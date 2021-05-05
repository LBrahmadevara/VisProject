import React, { useState, useEffect, useRef } from "react";
import {
  select,
  scaleBand,
  scaleLinear,
  axisBottom,
  axisLeft,
  scaleOrdinal,
} from "d3";
import * as d3 from "d3";
import "./BarChart.css";
import axios from "axios";
import { MenuItem, Select, InputLabel } from "@material-ui/core";

const BarChart = () => {
  // data => y-axis values
  const [data, setData] = useState([]);
  // xValues => x-axis values
  const [xValues, setxValues] = useState([]);
  const [monthSelector, setMonthSelector] = useState("All Months");
  const [yearSelector, setYearSelector] = useState("2019");
  const svgRef = useRef();
  const [isYearSelected, setIsYearSelected] = useState(true);
  const [isMonthSelected, setIsMonthSelected] = useState(false);
  const [isEmptyGraph, setIsEmptyGraph] = useState(false);
  const [availTotal, setAvailTotal] = useState([]);
  const maxVal = d3.max(availTotal);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const fetchAPIYear = async () => {
    const body = {
      csv: "monthly_updated.csv",
    };
    await axios.post("/csv/barChart/year", body).then((res) => {
      setIsYearSelected(false);
      setxValues(res.data["xValues"]);
      setAvailTotal(res.data["yValues"]);
      setData(res.data["values"]);
    });
  };

  useEffect(() => {
    const svg = select(svgRef.current);
    if (isYearSelected) {
      fetchAPIYear();
    }

    const hoverText = d3
      .select("body")
      .append("div")
      .attr("class", "hoverText");

    // Axis Scaling
    const xScale = scaleBand()
      .domain(xValues.map((val, index) => val))
      .range([0, 1000])
      .padding(0.5);

    // xScale1 is for mapping x-coordinates in bar graph
    const xScale1 = scaleBand()
      .domain(xValues.map((val, index) => index))
      .range([0, 1000])
      .padding(0.5);

    const yScale = scaleLinear()
      .domain([0, maxVal + 50])
      .range([300, 0]);

    const colorScale = scaleLinear()
      .domain([0, maxVal + 50])
      .range(["rgb(241, 201, 125)", "rgb(241, 201, 125)"]);

    const xAxis = axisBottom(xScale).ticks(data.length);
    if (!isMonthSelected) {
      svg.select(".x-axis").style("transform", "translateY(300px)").call(xAxis);
    } else {
      svg
        .select(".x-axis")
        .style("transform", "translateY(300px)")
        .call(xAxis)
        .selectAll("text")
        .attr("y", 8)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start");
    }

    const yAxis = axisLeft(yScale).ticks(7);
    svg.select(".y-axis").call(yAxis);

    // Axis titles
    svg
      .select(".y-title")
      .append("text")
      .attr("font-family", "inherit")
      .attr("x", -10)
      .attr("y", -1)
      .attr("transform", "translate(-60,250) rotate(270)")
      .text("Number of Availabilities");

    svg
      .select(".x-title")
      .append("text")
      .attr("font-family", "inherit")
      .attr("font-size", 16)
      .attr("x", 200)
      .attr("y", 20)
      .attr("transform", "translate(250,350) rotate(0)")
      .text("San Diego");

    // bar chart
    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      // to flip upside down
      .style("transform", "scale(1,-1")
      .attr("x", (val, index) => xScale1(index))
      .attr("y", -300)
      .attr("width", xScale.bandwidth())

      .on("mousemove", (event, value) => {
        hoverText
          .style("left", event.pageX + 20 + "px")
          .style("top", event.pageY - 60 + "px")
          .style("display", "inline-block")
          .html(
            `${data.length > 20 ? "Day" : "Month"}: ${value.Month}` +
              "<br>" +
              `Availabilities: ${value.Availability}`
          );
      })
      .on("mouseout", (d) => {
        hoverText.style("display", "none");
      })

      .transition()
      .attr("fill", (d) => {
        return colorScale(d.Availability);
      })
      .attr("height", (value) => {
        return 300 - yScale(value.Availability);
      });
  }, [data]);

  const handleMonthSelector = (event) => {
    setMonthSelector(event.target.value);
    if (yearSelector === "2019") {
      if (months.includes(event.target.value)) {
        let month = months.indexOf(event.target.value) + 1;
        const body = {
          csv: "daily.csv",
          month: month,
        };
        axios.post("/csv/barChart/month", body).then((res) => {
          setIsMonthSelected(true);
          setxValues(res.data["xValues"]);
          setAvailTotal(res.data["yValues"]);
          setData(res.data["values"]);
        });
      }
      if (event.target.value === "All Months") {
        setIsMonthSelected(false);
        fetchAPIYear();
      }
    }
  };

  const handleYearSelector = (event) => {
    setIsMonthSelected(false);
    setYearSelector(event.target.value);
    if (event.target.value === "2019") {
      setIsEmptyGraph(false);
      if (monthSelector !== "All Months") {
        let month = months.indexOf(monthSelector) + 1;
        const body = {
          csv: "daily.csv",
          month: month,
        };
        axios.post("/csv/barChart/month", body).then((res) => {
          setIsMonthSelected(true);
          setxValues(res.data["xValues"]);
          setAvailTotal(res.data["yValues"]);
          setData(res.data["values"]);
        });
      } else {
        fetchAPIYear();
      }
    } else {
      setIsEmptyGraph(true);
      setIsYearSelected(false);
    }
  };

  return (
    <div className="bar-main d-flex flex-column justify-content-center align-items-center mt-4 pt-4">
      <div className="selector d-flex flex-row justify-content-end align-items-end">
        <div className=" d-flex flex-column p-2">
          <InputLabel className="">Month</InputLabel>
          <Select
            label="Select"
            value={monthSelector}
            onChange={handleMonthSelector}
            variant="outlined"
          >
            <MenuItem value="All Months">All Months</MenuItem>
            {months.map((val, index) => (
              <MenuItem value={val} key={index}>
                {val}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div className="d-flex flex-column p-2">
          <InputLabel className="">Year</InputLabel>
          <Select
            label="Select"
            value={yearSelector}
            onChange={handleYearSelector}
            variant="outlined"
          >
            {/* <MenuItem value="None">None</MenuItem> */}
            <MenuItem value="2019">2019</MenuItem>
            <MenuItem value="2020">2020</MenuItem>
            <MenuItem value="2021">2021</MenuItem>
          </Select>
        </div>
      </div>
      <div className="d-flex mt-4 w-100 justify-content-center">
        {!isEmptyGraph ? (
          <svg
            ref={svgRef}
            style={{ width: "1000px", height: "300px", overflow: "visible" }}
          >
            <g className="x-axis" />
            <g className="y-axis" />
            <g className="y-title" />
            <g className="x-title" />
          </svg>
        ) : (
          <div
            style={{ width: "1000px", height: "300px", overflow: "visible" }}
            className="d-flex justify-content-center align-items-center"
          >
            data not available
          </div>
        )}
      </div>
    </div>
  );
};

export default BarChart;
