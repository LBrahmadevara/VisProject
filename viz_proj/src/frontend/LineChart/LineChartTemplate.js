import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";
import { scaleBand, select, scaleLinear } from "d3";
import "./LineChart.css";

const LineChartTemplate = () => {
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
  const cities = ["USA", "Canada"];
  console.log(cities.indexOf("USA"));
  const [data, setData] = useState([
    {
      name: "USA",
      values: [
        { date: "Jan", price: "100" },
        { date: "Feb", price: "110" },
        { date: "Mar", price: "145" },
        { date: "Apr", price: "241" },
        { date: "May", price: "101" },
        { date: "June", price: "90" },
        { date: "July", price: "10" },
        { date: "Aug", price: "35" },
        { date: "Sep", price: "21" },
        { date: "Oct", price: "201" },
        { date: "Nov", price: "60" },
        { date: "Dec", price: "101" },
      ],
    },
    {
      name: "Canada",
      values: [
        { date: "Jan", price: "200" },
        { date: "Feb", price: "120" },
        { date: "Mar", price: "33" },
        { date: "Apr", price: "21" },
        { date: "May", price: "51" },
        { date: "June", price: "190" },
        { date: "July", price: "120" },
        { date: "Aug", price: "85" },
        { date: "Sep", price: "221" },
        { date: "Oct", price: "101" },
        { date: "Nov", price: "200" },
        { date: "Dec", price: "120" },
      ],
    },
  ]);

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
        d.price = +d.price;
      });
    });


    const xScale = scaleBand()
      .domain(months.map((val, index) => val))
      .range([0, 1000])
      .padding(1);

    const xScale1 = scaleBand()
      .domain(months.map((val, index) => index))
      .range([0, 1000])
      .padding(0.5);

    let yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data[0].values, (d) => d.price)])
      .range([height - margin, 0]);

    let color = d3.scaleOrdinal(d3.schemeCategory10);

    const colorScale = scaleLinear().domain([0, 1]).range(["blue", "brown"]);

    console.log(colorScale(0));

    /* Add Axis into SVG */
    let xAxis = d3.axisBottom(xScale).ticks(data.length);
    let yAxis = d3.axisLeft(yScale).ticks(5);

    svg.select(".x-axis").style("transform", `translateY(350px)`).call(xAxis);
    svg.select(".y-axis").call(yAxis);

    //   /* Add line into SVG */
    let line = d3
      .line()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.price));

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
          .text(i.name)
          .style("fill", colorScale(cities.indexOf(i.name)))
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
        console.log(i);
        svg
          .selectAll(".circle-text")
          .data([data])
          .join((enter) => enter.append("text"))
          .attr("class", "circle-text")
          .text(`${i.price}`)
          .attr("x", d["offsetX"] + 15)
          .attr("y", d["offsetY"] - 10);
        d3.select(this).style("cursor", "pointer");
      })
      .on("mouseleave", (d, i) => {
        svg.selectAll(".circle-text").remove();
        d3.select(this).style("cursor", "none");
      })
      .append("circle")
      .attr("cx", (d) => xScale(d.date))
      .attr("cy", (d) => yScale(d.price))
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
    <div className="justify-content-center">
      <svg
        id="chart"
        ref={svgRef}
        style={{ width: `1000px`, height: `400px`, overflow: "visible" }}
      >
        <g className="x-axis" />
        <g className="y-axis" />
        {/* <g className="line-group" /> */}
      </svg>
    </div>
  );
};

export default LineChartTemplate;
