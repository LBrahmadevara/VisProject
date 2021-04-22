import React, { useEffect, useRef, useState } from "react";
import {
  select,
  scaleBand,
  axisBottom,
  stack,
  max,
  scaleLinear,
  axisLeft,
  stackOrderAscending,
} from "d3";

const StackedBarChartTemplate = ({ data, keys, colors }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = select(svgRef.current);

    // Stacks / layers
    const stackGenerator = stack().keys(keys).order(stackOrderAscending);
    const layers = stackGenerator(data);
    const extent = [
      0,
      max(layers, (layer) => max(layer, (sequence) => sequence[1])) + 500,
    ];

    // Scaling
    const xScale = scaleBand()
      .domain(data.map((d) => d.Month))
      .range([0, 1000])
      .padding(0.45);

    const yScale = scaleLinear().domain(extent).range([300, 0]);

    // Axis
    const xAxis = axisBottom(xScale);
    svg.select(".x-axis").style("transform", "translateY(300px)").call(xAxis);

    const yAxis = axisLeft(yScale);
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
      .selectAll(".layer")
      .data(layers)
      .join("g")
      .attr("class", "layer")
      .attr("fill", (layer) => colors[layer.key])
      .selectAll("rect")
      .data((layer) => layer)
      .join("rect")
      .attr("x", (sequence) => xScale(sequence.data.Month))
      .attr("width", xScale.bandwidth())
      .on("mouseenter", (event, value) => {
        svg
          .selectAll(".tooltip")
          .data(value)
          .join((enter) => enter.append("text"))
          .attr("class", "tooltip")
          //   .text(value[1])
          .attr("text-anchor", "middle")
          .transition()
          .attr("font-size", 18)
          .style("opacity", 2);
      })

      .on("mousemove", (event, value) => {
        svg
          .select(".tooltip")
          .text(`$${value[1]}`)
          .attr("x", event.offsetX + 50 + "px")
          .attr("y", event.offsetY - 1 + "px");
      })

      .on("mouseleave", () => svg.select(".tooltip").remove())

      .attr("y", (sequence) => yScale(sequence[1]))
      .attr("height", (sequence) => yScale(sequence[0]) - yScale(sequence[1]));
  }, [data, keys, colors]);
  return (
    // <div>
    <svg
      ref={svgRef}
      style={{ width: "1000px", height: "300px", overflow: "visible" }}
    >
      <g className="x-axis" />
      <g className="y-axis" />
      <g className="y-title" />
    </svg>
    // </div>
  );
};

export default StackedBarChartTemplate;
