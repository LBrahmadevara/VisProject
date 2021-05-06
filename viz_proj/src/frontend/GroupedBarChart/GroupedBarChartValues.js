import React, { useState, useEffect } from "react";
import { Checkbox, InputLabel, MenuItem, Select } from "@material-ui/core";
import axios from "axios";
import "../StackedBarChart/StackedBarChart.css";
import GroupedBarChartTemplate from "./GroupedBarChartTemplate";

const GroupedBarChartValues = () => {
  const [data, setData] = useState([]);
  const [locSelector, setLocSelector] = useState(["San Diego"]);

  const [allKeys, setAllKeys] = useState([
    "Low Prices",
    "Avg Prices",
    "Peak Prices",
  ]);
  const [keys, setKeys] = useState(allKeys);

  const colors = {
    "Low Prices": "#7b4806",
    "Avg Prices": "#e28f24",
    "Peak Prices": "burlywood",
  };
  const [isDataFetched, setIsDataFetched] = useState(true);
  const fetchData = () => {
    const body = {
      loc: "San Diego",
      csv: "avg_prices.csv",
    };
    axios.post("/csv/groupCol", body).then((res) => {
      setData(res.data["data"]);
      setIsDataFetched(false);
    });
  };
  useEffect(() => {
    if (isDataFetched) {
      fetchData();
    }
  }, [data]);

  const handleLocSelector = (event) => {
    setLocSelector(event.target.value);
    if (event.target.value === "San Diego") {
      fetchData();
    } else {
      const body = {
        loc: "San Francisco",
        csv: "avg_prices.csv",
      };
      axios.post("/csv/groupCol", body).then((res) => {
        setData(res.data["data"]);
        setIsDataFetched(false);
      });
    }
  };
  return (
    <div className="groupBar-main d-flex flex-column mt-3 shadow">
      <div className="group-selector d-flex flex-row justify-content-between mb-4 ml-4">
        <h5 className="bar-title p-4">
          Low, Average and Peak Prices in {locSelector}
        </h5>
        <div className="d-flex flex-row justify-content-end align-items-end pt-4">
          <div className="d-flex flex-column">
            <InputLabel>Location</InputLabel>
            <Select
              label="Select"
              value={locSelector}
              onChange={handleLocSelector}
              variant="outlined"
            >
              <MenuItem value="San Diego">San Diego</MenuItem>
              <MenuItem value="San Francisco">San Francisco</MenuItem>
            </Select>
          </div>
        </div>
      </div>
      <div className="template-main d-flex mt-4 justify-content-center">
        {data.length !== 0 && (
          <GroupedBarChartTemplate data={data} keys={keys} colors={colors} />
        )}
      </div>
      <div className="d-flex justify-content-center pt-4 mt-2">
        {allKeys.map((key) => (
          <div
            key={key}
            className="d-flex justify-content-center align-items-center"
          >
            <div>
              <Checkbox
                // .includes => checks whether key is included in keys and returns boolean
                checked={keys.includes(key)}
                size="small"
                onChange={(e) => {
                  if (e.target.checked) {
                    setKeys(Array.from(new Set([...keys, key])));
                  } else {
                    setKeys(keys.filter((_key) => _key !== key));
                  }
                }}
                name="checkBox"
                color="primary"
              />
            </div>
            <div style={{ color: colors[key], fontWeight: "bold" }}>{key}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupedBarChartValues;
