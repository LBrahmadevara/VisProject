import React, { useState, useEffect } from "react";
import axios from "axios";
import PieChartTemplate from "./PieChartTemplate";
import "./PieChart.css";
import { MenuItem, Select, InputLabel } from "@material-ui/core";

const PieChartValues = () => {
  const [data, setData] = useState([]);
  const [totalAvailabilites, setTotalAvailabilites] = useState(0);
  const [locSelector, setLocSelector] = useState("San Diego");
  const [monthSelector, setMonthSelector] = useState("All");
  const [isYearSelected, setIsYearSelected] = useState(true);

  const location = ["San Diego", "San Francisco"];
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

  const fetchData = () => {
    const body = {
      csv: "room_type.csv",
      loc: "San Diego",
      mon: "All",
    };
    axios.post("/csv/pieChart/location", body).then((res) => {
      setTotalAvailabilites(res.data.totalAvailabilites);
      setIsYearSelected(false);
      setData(res.data.pieData);
    });
  };

  useEffect(() => {
    if (isYearSelected) {
      fetchData();
    }
  }, [data]);

  const handleLocSelector = (event) => {
    if (event.target.value === "San Francisco") {
      const body = {
        csv: "room_type.csv",
        loc: "San Francisco",
        mon: "All",
      };
      axios.post("/csv/pieChart/location", body).then((res) => {
        // console.log(res.data.pieData);
        setTotalAvailabilites(res.data.totalAvailabilites);
        setIsYearSelected(false);
        setLocSelector(event.target.value);
        setData(res.data.pieData);
      });
    } else {
      setLocSelector(event.target.value);
      fetchData();
    }
  };

  const handleMonthSelector = (event) => {
    let body = {};
    if (event.target.value === "All") {
      body = {
        csv: "room_type.csv",
        loc: locSelector,
        mon: event.target.value,
      };
    } else {
      body = {
        csv: "room_type_per_month.csv",
        loc: locSelector,
        mon: event.target.value,
      };
    }
    axios.post("/csv/pieChart/location", body).then((res) => {
      // console.log(res.data);
      setTotalAvailabilites(res.data.totalAvailabilites);
      setIsYearSelected(false);
      setMonthSelector(event.target.value);
      setData(res.data.pieData);
    });
  };

  return (
    <div className="pie-main d-flex flex-column justify-content-center align-items-center shadow">
      <div className="pie-selector d-flex flex-row justify-content-between mb-4">
        <h5 className="bar-title p-4">
          Most popular room type in {locSelector}
        </h5>
        <div className="drop-down d-flex flex-row justify-content-end align-items-end">
          <div className="p-2">
            <InputLabel className="">Location</InputLabel>
            <Select
              label="Select"
              value={locSelector}
              onChange={handleLocSelector}
              variant="outlined"
            >
              {location.map((val, index) => (
                <MenuItem value={val} key={index}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="p-2">
            <InputLabel className="">Month</InputLabel>
            <Select
              label="Select"
              value={monthSelector}
              onChange={handleMonthSelector}
              variant="outlined"
            >
              <MenuItem value="All">All</MenuItem>
              {months.map((val, index) => (
                <MenuItem value={index} key={index}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>
      </div>
      {data.length !== 0 && (
        <PieChartTemplate
          values={data}
          totalAvailabilites={totalAvailabilites}
        />
      )}
    </div>
  );
};

export default PieChartValues;
