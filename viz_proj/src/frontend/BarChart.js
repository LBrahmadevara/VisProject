import React, { useState, useEffect, useRef } from "react";
import { select, scaleBand, scaleLinear, axisBottom, axisLeft } from "d3";
import * as d3 from "d3";
import "./BarChart.css";
import axios from "axios";
import { MenuItem, Select, InputLabel } from "@material-ui/core";

const BarChart = () => {
  const [data, setData] = useState([
    20,
    40,
    5,
    60,
    25,
    70,
    30,
    70,
    40,
    20,
    80,
    10,
  ]);
  const [xValues, setxValues] = useState([
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
  ]);
  const [monthSelector, setMonthSelector] = useState("None");
  const [yearSelector, setYearSelector] = useState("None");
  const svgRef = useRef();
  const maxVal = d3.max(data);

  useEffect(() => {
    const svg = select(svgRef.current);

    // Axis Scaling
    const xScale = scaleBand()
      .domain(xValues.map((val, index) => val))
      .range([0, 600])
      .padding(0.5);

    // xScale1 is for mapping x-coordinates in bar graph
    const xScale1 = scaleBand()
      .domain(xValues.map((val, index) => index))
      .range([0, 600])
      .padding(0.5);

    const yScale = scaleLinear().domain([0, maxVal]).range([300, 0]);

    const colorScale = scaleLinear()
      .domain([0, maxVal])
      .range(["orange", "orange"]);

    const xAxis = axisBottom(xScale).ticks(data.length);
    svg.select(".x-axis").style("transform", "translateY(300px)").call(xAxis);

    // const yAxis = axisLeft(yScale).ticks(Math.round(data.length / 2));
    const yAxis = axisLeft(yScale).ticks(7);
    svg.select(".y-axis").call(yAxis);

    // Axis titles
    svg
      .select(".y-title")
      .append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 18)
      .attr("x", -10)
      .attr("y", -1)
      .attr("transform", "translate(-60,250) rotate(270)")
      .text("Number of Availabilities");

    svg
      .select(".x-title")
      .append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 18)
      .attr("x", -10)
      .attr("y", -1)
      .attr("transform", "translate(250,350) rotate(0)")
      .text("Year 2019");

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
  }, [data, xValues]);

  const handleMonthSelector = (event) => {
    setMonthSelector(event.target.value);
    if (xValues.includes(event.target.value)){
        console.log(xValues.indexOf(event.target.value)+1)
        let month = xValues.indexOf(event.target.value)+1
        const body ={
            'csv': "daily.csv",
            'month': month
        }
        axios.post('/csv/barChart/month', body)
        .then((res) => {
            console.log(res.data['xValues'])
            setData(res.data["yValues"])
            // setxValues(res.data['xValues'])
            // console.log(res)
        })

    }
  };

  const handleYearSelector = (event) => {
    setYearSelector(event.target.value);
    const body = {
        "csv" : "monthly_updated.csv"
    }
    if (event.target.value === '2019'){
        axios.post('/csv/barChart', body)
        .then((res) => {
            // console.log(res.data["yValues"]);
            setData(res.data["yValues"])
        })
    }
  };

  return (
    <div className="bar-main d-flex flex-column justify-content-center align-items-center mt-4 pt-4">
        <div className="selector d-flex flex-row justify-content-end align-items-end">
      <div className=" d-flex flex-column p-2">
        {/* <div className="d-flex flex-column align-items-end justify-content-end"> */}
        <InputLabel className="">
          Month
        </InputLabel>
        <Select
          label="Select"
          value={monthSelector}
          onChange={handleMonthSelector}
          variant="outlined"
        >
          <MenuItem value="None">None</MenuItem>
          {xValues.map((val, index) => (
            <MenuItem value={val} key={index}>
              {val}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className="d-flex flex-column p-2">
        <InputLabel className="">
          Year
        </InputLabel>
        <Select
          label="Select"
          value={yearSelector}
          onChange={handleYearSelector}
          variant="outlined"
        >
          <MenuItem value="None">None</MenuItem>
          <MenuItem value="2019">2019</MenuItem>
        </Select>
      </div></div>
      <div className="d-flex mt-4 w-100 justify-content-center">
        <svg
          ref={svgRef}
          style={{ width: "600px", height: "300px", overflow: "visible" }}
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
