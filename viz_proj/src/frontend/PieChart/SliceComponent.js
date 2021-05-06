import React, { useState, useEffect, createRef } from "react";
import { arc } from "d3-shape";
import { select } from "d3";

const animateSlice = (sliceRef, slice, innerRadius, outerRadius) => {
  const el = select(sliceRef.current);
  const arcFinal3 = arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .startAngle(slice.startAngle)
    .endAngle(slice.endAngle);
  el.select("path").transition().duration(600).attr("d", arcFinal3);
};

const sliceTextStyle = {
  fontSize: "10px",
  fontFamily: "verdana",
  fontWeight: "bold",
};

const donutTextStyle = {
  fontSize: "15px",
  fontFamily: "verdana",
  fontWeight: "bold",
};

const SliceComponent = (props) => {
  const sliceRef = createRef();
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const [unHoveredSlice, setUnHoveredSlice] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const angle = (value) => {
    let a = ((value.startAngle + value.endAngle) * 90) / Math.PI - 90;
    return a > 90 ? a - 180 : a;
  };

  const outerRadius = 180;
  const innerRadius = outerRadius / 2;

  const { index, value, label, fill, dataValue, totalAvailabilites } = props;

  const sliceArc = arc().innerRadius(innerRadius).outerRadius(outerRadius);

  useEffect(() => {
    if (hoveredSlice !== null) {
      const selectedInnerRadius = innerRadius * 1.1;
      const selectedOuterRadius = outerRadius * 1.1;
      animateSlice(
        sliceRef,
        hoveredSlice,
        selectedInnerRadius,
        selectedOuterRadius
      );
    }
    setUnHoveredSlice(null);
  }, [hoveredSlice, sliceRef]);

  useEffect(() => {
    if (unHoveredSlice !== null) {
      animateSlice(sliceRef, unHoveredSlice, innerRadius, outerRadius);
    }
    setHoveredSlice(null);
  }, [unHoveredSlice, sliceRef, innerRadius]);

  return (
    <g
      onMouseEnter={() => {
        setIsHovered(true);
        setHoveredSlice(value);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setUnHoveredSlice(value);
      }}
      ref={sliceRef}
      index={index}
    >
      <path d={sliceArc(value)} fill={fill} />
      <text
        transform={`translate(${sliceArc.centroid(value)}) rotate(${angle(
          value
        )})`}
        dy=".35em"
        textAnchor="middle"
        fill="white"
        style={{
          fontSize: "10px",
          fontFamily: "verdana",
          fontWeight: "bold",
          margin: "10px",
        }}
      >
        {label}
      </text>
      {isHovered && (
        <text
          x="0"
          y="-1.5em"
          textAnchor="middle"
          style={donutTextStyle}
          fill={fill}
        >
          <tspan dy="1em" x="0.3em">
            {dataValue}
          </tspan>
          <tspan dy="1em" x="0.3em">
            {label}s
          </tspan>
          <tspan dy="1em" x="0.3em">
            ({Math.round((dataValue / totalAvailabilites) * 100)}%)
          </tspan>
        </text>
      )}
    </g>
  );
};

export default SliceComponent;
