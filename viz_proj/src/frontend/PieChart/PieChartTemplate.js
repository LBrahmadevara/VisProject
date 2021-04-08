import React, { useState } from "react";
import { schemeCategory10, scaleOrdinal } from "d3";
import * as d3 from "d3";
import SliceComponent from "./SliceComponent";
import "./PieChart.css"

const PieChartTemplate = (props) => {
  const [data, setData] = useState([]);
  const [totalAvailabilites, setTotalAvailabilites] = useState(0);

  const height = 400;
  const width = 400;
  const colorScale = scaleOrdinal(schemeCategory10);

  if (props.values !== data) {
    setTotalAvailabilites(props.totalAvailabilites);
    setData(props.values);
  }

  let pieChart = d3.pie().sort(null);
  const availabilities = data.map((item) => item.availability);

  const renderSlice = (availability) => {
    const index = availability.index;
    return (
      <SliceComponent
        key={index}
        index={index}
        value={availability}
        label={data[index].room_type}
        fill={colorScale(index)}
        dataValue={data[index].availability}
        totalAvailabilites={totalAvailabilites}
      />
    );
  };

  return (
    <div className="d-flex justify-content-center" style={{width: 900, height:300}}>
      <svg height={height} width={width} className="d-flex justify-content-center">
        <g className="" transform={`translate(${200},${200})`}>
          {pieChart(availabilities).map(renderSlice)}
        </g>
      </svg>
    </div>
  );
};

export default PieChartTemplate;
