import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { scaleBand, select, scaleLinear } from "d3";
import "./LineChart.css";

const LineChartTemplate = (props) => {
  const { cities, months } = props;
  const [data, setData] = useState(props.data);

  let width = 1000;
  let height = 400;
  let margin = 50;
  let duration = 250;

  let lineOpacity = "0.5";
  let lineOpacityHover = "0.85";
  let otherLinesOpacityHover = "0.1";
  let lineStroke = "1.5px";
  let lineStrokeHover = "2.5px";

  let circleOpacity = "1";
  let circleOpacityOnLineHover = "0.25";
  let circleRadius = 3;
  let circleRadiusHover = 6;

  const svgRef = useRef();
  useEffect(() => {
    const svg = select(svgRef.current);
    /* Format Data */
    data.forEach(function (d) {
      d.values.forEach(function (d) {
        d.Availability = +d.Availability;
      });
    });

    const xScale = scaleBand()
      .domain(months.map((val, index) => val))
      .range([0, 1000])
      .padding(1);

    // const xScale1 = scaleBand()
    //   .domain(months.map((val, index) => index))
    //   .range([0, 1000])
    //   .padding(0.5);

    let yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data[0].values, (d) => d.Availability) + 15000])
      .range([height - margin, 0]);

    // let color = d3.scaleOrdinal(d3.schemeCategory10);

    const colorScale = scaleLinear()
      .domain([0, 1])
      .range(["rgb(101 52 6)", "rgb(239 123 11)"]);

    // console.log(colorScale(0));

    /* Add Axis into SVG */
    let xAxis = d3.axisBottom(xScale).ticks(data.length);
    let yAxis = d3.axisLeft(yScale).ticks(5);

    svg.select(".x-axis").style("transform", `translateY(350px)`).call(xAxis);
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
      .attr("y", 60)
      .attr("transform", "translate(250,350) rotate(0)")
      .text("San Diego");

    //   /* Add line into SVG */
    let line = d3
      .line()
      .x((d) => xScale(d.Month))
      .y((d) => yScale(d.Availability));

    let lines = svg.append("g").attr("class", "lines");

    lines
      .selectAll(".line-group")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "line-group")
      .on("mouseenter", function (d, i) {
        svg
          .selectAll(".title-text")
          .data([data])
          .join((enter) => enter.append("text"))
          .attr("class", "title-text")
          .text(i.city)
          .style("fill", colorScale(cities.indexOf(i.city)))
          .attr("text-anchor", "middle")
          .attr("x", width - margin)
          .attr("y", 5);
      })
      .on("mouseleave", (d) => {
        svg.select(".title-text").remove();
      })
      .append("path")
      .attr("class", "line")
      .attr("d", (d) => line(d.values))
      .style("stroke", (d, i) => colorScale(i))
      .style("opacity", lineOpacity)
      .on("mouseenter", function (d) {
        svg.selectAll(".line").style("opacity", otherLinesOpacityHover);
        svg.selectAll(".circle").style("opacity", circleOpacityOnLineHover);
        d3.select(this)
          .style("opacity", lineOpacityHover)
          .style("stroke-width", lineStrokeHover)
          .style("cursor", "pointer");
      })
      .on("mouseleave", function (d) {
        svg.selectAll(".line").style("opacity", lineOpacity);
        svg.selectAll(".circle").style("opacity", circleOpacity);
        d3.select(this)
          .style("stroke-width", lineStroke)
          .style("cursor", "none");
      });

    svg
      .selectAll(".circle-group")
      .data(data)
      .enter()
      .append("g")
      .style("fill", (d, i) => colorScale(i))
      .selectAll("circle")
      .data((d) => d.values)
      .enter()
      .append("g")
      .attr("class", "circle")
      .on("mouseenter", function (d, i) {
        // console.log(i);
        svg
          .selectAll(".circle-text")
          .data([data])
          .join((enter) => enter.append("text"))
          .attr("class", "circle-text")
          .text(`${i.Availability}`)
          .attr("x", d["offsetX"] + 15)
          .attr("y", d["offsetY"] - 10);
        d3.select(this).style("cursor", "pointer");
      })
      .on("mouseleave", (d, i) => {
        svg.selectAll(".circle-text").remove();
        d3.select(this).style("cursor", "none");
      })
      .append("circle")
      .attr("cx", (d) => xScale(d.Month))
      .attr("cy", (d) => yScale(d.Availability))
      .attr("r", circleRadius)
      .style("opacity", circleOpacity)
      .on("mouseenter", function (d) {
        d3.select(this)
          .transition()
          .duration(duration)
          .attr("r", circleRadiusHover);
      })
      .on("mouseleave", function (d) {
        d3.select(this).transition().duration(duration).attr("r", circleRadius);
      });
  }, [data]);

  return (
    // <div className="justify-content-center">
    <svg
      id="chart"
      ref={svgRef}
      style={{ width: `1000px`, height: `400px`, overflow: "visible" }}
    >
      <g className="x-axis" />
      <g className="y-axis" />
      <g className="y-title" />
      <g className="x-title" />
      {/* <g className="line-group" /> */}
    </svg>
    // </div>
  );
};

export default LineChartTemplate;
