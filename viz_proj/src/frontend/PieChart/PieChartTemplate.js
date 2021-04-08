import React, { useState } from "react";
import { schemeCategory10, scaleOrdinal } from "d3";
import * as d3 from "d3";
import SliceComponent from "./SliceComponent";

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
    <div>
      <svg height={height} width={width}>
        <g transform={`translate(${150},${200})`}>
          {pieChart(availabilities).map(renderSlice)}
        </g>
      </svg>
    </div>
  );
};

export default PieChartTemplate;
