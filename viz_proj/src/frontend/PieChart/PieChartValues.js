import React, { useState, useEffect } from "react";
import axios from "axios";
import PieChartTemplate from "./PieChartTemplate";
import "./PieChart.css";
import { MenuItem, Select, InputLabel } from "@material-ui/core";

const PieChartValues = () => {
  const [data, setData] = useState([]);
  const [totalAvailabilites, setTotalAvailabilites] = useState(0);
  const [locSelector, setLocSelector] = useState("San Francisco");
  const [monthSelector, setMonthSelector] = useState("All");
  const [isYearSelected, setIsYearSelected] = useState(true);
  const [isMonthSelected, setIsMonthSelected] = useState(false);

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
      loc: "San Francisco",
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
    if (event.target.value === "San Diego") {
      const body = {
        csv: "room_type.csv",
        loc: "San Diego",
      };
      axios.post("/csv/pieChart/location", body).then((res) => {
        setTotalAvailabilites(res.data.totalAvailabilites);
        setIsYearSelected(false);
        setLocSelector(event.target.value);
        setData(res.data.pieData);
      });
    }
    else{
      setLocSelector(event.target.value);
      fetchData()
    }
  };

  const handleMonthSelector = (event) => {
    setMonthSelector(event.target.value);
  };

  return (
    <div className="pie-main d-flex flex-column justify-content-center align-items-center">
      <div className="d-flex">
        <div>
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
        <div>
          <InputLabel className="">Month</InputLabel>
          <Select
            label="Select"
            value={monthSelector}
            onChange={handleMonthSelector}
            variant="outlined"
          >
            <MenuItem value="All">All</MenuItem>
            {months.map((val, index) => (
              <MenuItem value={val} key={index}>
                {val}
              </MenuItem>
            ))}
          </Select>
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
