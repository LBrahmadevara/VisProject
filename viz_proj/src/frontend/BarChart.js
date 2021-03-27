import React, { useState, useEffect, useRef } from "react";
import { select, scaleBand, scaleLinear, axisBottom, axisLeft } from "d3";
import * as d3 from "d3";
import "./BarChart.css";
import axios from "axios";
import { MenuItem, Select, InputLabel } from "@material-ui/core";

const BarChart = () => {
  // data => y-axis values
  const [data, setData] = useState([]);
  // xValues => x-axis values
  const [xValues, setxValues] = useState([]);
  const [monthSelector, setMonthSelector] = useState("None");
  const [yearSelector, setYearSelector] = useState("2019");
  const svgRef = useRef();
  const maxVal = d3.max(data);
  const [isYearSelected, setIsYearSelected] = useState(true);
  const [isMonthSelected, setIsMonthSelected] = useState(false);
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
      console.log(res.data);
      setIsYearSelected(false);
      setxValues(res.data["xValues"]);
      setData(res.data["yValues"]);
    });
  };

  useEffect(() => {
    const svg = select(svgRef.current);
    if (isYearSelected) {
      fetchAPIYear();
    }
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

    const yScale = scaleLinear().domain([0, maxVal]).range([300, 0]);

    const colorScale = scaleLinear()
      .domain([0, maxVal])
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
      .text("San Diego (Year 2019)");

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

      // events handling
      .on("mouseenter", (event, value) => {
        svg
          .selectAll(".tooltip")
          .data([value])
          .join((enter) => enter.append("text"))
          .attr("class", "tooltip")
          .text(value)
          .attr("text-anchor", "middle")
          .transition()
          .attr("font-size", 18)
          .style("opacity", 2);
      })

      .on("mousemove", (event, value) => {
        svg
          .select(".tooltip")
          .text(value)
          .attr("x", event.offsetX + 50 + "px")
          .attr("y", event.offsetY - 1 + "px");
      })

      .on("mouseleave", () => svg.select(".tooltip").remove())

      .transition()
      .attr("fill", colorScale)
      .attr("height", (value) => 300 - yScale(value));
  }, [data]);

  const handleMonthSelector = (event) => {
    setMonthSelector(event.target.value);
    setIsMonthSelected(true);
    setIsYearSelected(false);
    setYearSelector("None");
    if (months.includes(event.target.value)) {
      console.log(months.indexOf(event.target.value) + 1);
      let month = months.indexOf(event.target.value) + 1;
      const body = {
        csv: "daily.csv",
        month: month,
      };
      axios.post("/csv/barChart/month", body).then((res) => {
        console.log(res.data);
        setxValues(res.data["xValues"]);
        setData(res.data["yValues"]);
      });
    }
  };

  const handleYearSelector = (event) => {
    setYearSelector(event.target.value);
    setIsMonthSelected(false);
    setMonthSelector("None");
    if (!isYearSelected) {
      fetchAPIYear();
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
            <MenuItem value="None">None</MenuItem>
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
            <MenuItem value="None">None</MenuItem>
            <MenuItem value="2019">2019</MenuItem>
          </Select>
        </div>
      </div>
      <div className="d-flex mt-4 w-100 justify-content-center">
        <svg
          ref={svgRef}
          style={{ width: "1000px", height: "300px", overflow: "visible" }}
        >
          <g className="x-axis" />
          <g className="y-axis" />
          <g className="y-title" />
          <g className="x-title" />
        </svg>
      </div>
    </div>
  );
};

export default BarChart;
