import React, { useState, useEffect, useRef } from "react";
import { select, scaleBand, scaleLinear, axisBottom, axisLeft } from "d3";
import * as d3 from "d3";
import "./BarChart.css";

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
  const xValues = [
    "Jan",
    "feb",
    "mar",
    "apr",
    "may",
    "june",
    "july",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];
  const svgRef = useRef();
  const maxVal = d3.max(data);

  useEffect(() => {
    const svg = select(svgRef.current);

    // Axis Scaling
    const xScale = scaleBand()
      .domain(xValues.map((val, index) => val))
      .range([0, 600])
      .padding(0.5);

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

    const yAxis = axisLeft(yScale).ticks(Math.round(data.length / 2));
    svg.select(".y-axis").call(yAxis);

    // Axis titles
    svg
      .select(".y-title")
      .append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 18)
      .attr("x", -10)
      .attr("y", -1)
      .attr("transform", "translate(-30,250) rotate(270)")
      .text("Number of Availabilities");

    svg
      .select(".x-title")
      .append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 18)
      .attr("x", -10)
      .attr("y", -1)
      .attr("transform", "translate(250,350) rotate(0)")
      .text("Year 2020");

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
          .style("opacity", 2);
      })

      .on("mousemove", (event, value) => {
        svg
          .select(".tooltip")
          .text(value)
          .attr("x", event.offsetX + 20 + "px")
          .attr("y", event.offsetY - 1 + "px");
      })

      .on("mouseleave", () => svg.select(".tooltip").remove())

      .transition()
      .attr("fill", colorScale)
      .attr("height", (value) => 300 - yScale(value));
  }, [data]);
  return (
    <div className="d-flex justify-content-center mt-4 pt-4">
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
  );
};

export default BarChart;
