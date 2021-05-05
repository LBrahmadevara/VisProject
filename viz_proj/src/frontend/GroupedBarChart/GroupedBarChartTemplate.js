import React, { useEffect, useRef } from "react";
import { select, scaleBand, axisBottom, max, scaleLinear, axisLeft } from "d3";

const GroupedBarChartTemplate = ({ data, keys, colors }) => {
  const svgRef = useRef();
  useEffect(() => {
    const svg = select(svgRef.current);

    const extent = [0, max(data, (dict) => max(keys, (i) => dict[i]))];

    //Scaling
    const xScale0 = scaleBand()
      .domain(data.map((item) => item.Month))
      .range([0, 1000])
      .padding(0.1);
    const xScale1 = scaleBand()
      .domain(keys)
      .range([0, xScale0.bandwidth()])
      .padding(0.1);

    const yScale = scaleLinear().domain(extent).range([300, 0]);

    // Axis
    const xAxis = axisBottom(xScale0);
    svg.select(".x-axis").style("transform", "translateY(300px)").call(xAxis);

    const yAxis = axisLeft(yScale).ticks(4);
    svg.select(".y-axis").call(yAxis);

    // Axis titles
    svg
      .select(".y-title")
      .append("text")
      .attr("font-family", "inherit")
      .attr("x", -10)
      .attr("y", -1)
      .attr("transform", "translate(-60,180) rotate(270)")
      .text("Prices");

    svg
      .selectAll(".layer")
      .data(data)
      .join("g")
      .attr("class", "layer")
      .attr("transform", (d) => `translate(${xScale0(d.Month)}, 0)`)
      .selectAll("rect")
      .data((d) =>
        keys.map(function (key) {
          return { key: key, value: d[key] };
        })
      )
      .join("rect")
      .attr("x", (d) => xScale1(d.key))
      .attr("width", xScale1.bandwidth())

      .on("mouseenter", (event, value) => {
        svg
          .selectAll(".tooltip")
          .data([value["value"]])
          .join((enter) => enter.append("text"))
          .attr("class", "tooltip")
          .text([value["value"]])
          .attr("text-anchor", "middle")
          .transition()
          .attr("font-size", 18)
          .style("opacity", 2);
      })

      .on("mousemove", (event, value) => {
        svg
          .select(".tooltip")
          .text(`$${value.value}`)
          .attr("x", event.offsetX + 50 + "px")
          .attr("y", event.offsetY - 1 + "px");
      })

      .on("mouseleave", () => svg.select(".tooltip").remove())

      .attr("y", (d) => yScale(d.value))
      .attr("height", (d) => 300 - yScale(d.value))
      .attr("fill", (d) => colors[d.key]);
  });
  return (
    <svg
      ref={svgRef}
      style={{ width: "1000px", height: "300px", overflow: "visible" }}
    >
      <g className="x-axis" />
      <g className="y-axis" />
      <g className="y-title" />
    </svg>
  );
};

export default GroupedBarChartTemplate;
