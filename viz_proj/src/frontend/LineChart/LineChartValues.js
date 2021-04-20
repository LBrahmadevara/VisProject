import React, { useState, useEffect } from "react";
import axios from "axios";
import LineChartTemplate from "./LineChartTemplate";
import "./LineChart.css"

const LineChartValues = () => {
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
  const cities = ["San Francisco", "San Diego"];
  const [data, setData] = useState([]);
  const [isDataReceived, setIsDataReceived] = useState(true);

  const fetchApi = () => {
    const body = {
      csv: "Monthly_trend.csv",
    };
    axios.post("/csv/lineChart", body).then((res) => {
      setIsDataReceived(false);
      setData(res.data["lineData"]);
    });
  };

  useEffect(() => {
    if (isDataReceived) {
      fetchApi();
    }
  }, [data]);

  return (
    <div className="line-main d-flex flex-column justify-content-center align-items-center mt-4 pt-4">
      {data.length > 0 && (
        <LineChartTemplate months={months} data={data} cities={cities} />
      )}
    </div>
  );
};

export default LineChartValues;
