const express = require("express");
const csv = require("csv-parser");
const fs = require("fs");
const axios = require("axios");
const port = 4000;
const app = express();
let x = [];
let y = [];
let pieData = [];
let total_availabilites = 0;

app.use(express.json());

app.post("/csv/barChart/year", (req, res) => {
  fs.createReadStream(`../files/${req.body["csv"]}`)
    .pipe(csv())
    .on("data", (row) => {
      Object.entries(row).forEach(([key, value]) => {
        if (key.trim() == "Month") {
          x.push(value);
        }
        if (key === "Availability") {
          y.push(parseInt(value));
        }
      });
    })
    .on("end", () => {
      console.log("CSV file successfully processed and sent to frontend");
      res.send({ yValues: y, xValues: x });
      x = [];
      y = [];
    });
});

app.post("/csv/barChart/month", (req, res) => {
  let month = req.body["month"];
  fs.createReadStream(`../files/${req.body["csv"]}`)
    .pipe(csv())
    .on("data", (row) => {
      let push_availability = false;
      Object.entries(row).forEach(([key, value]) => {
        if (key.trim() == "Daily") {
          if (value.split("/")[0] == month) {
            x.push(value);
            push_availability = true;
          }
        }
        if (key === "Availability" && push_availability) {
          y.push(parseInt(value));
        }
      });
    })
    .on("end", () => {
      console.log("CSV file successfully processed and sent to frontend");
      res.send({ yValues: y, xValues: x });
      x = [];
      y = [];
    });
});


// logic for Pie chart
app.post("/csv/pieChart/location", (req, res) => {
  let csv_file = req.body["csv"];
  let loc = req.body["loc"];
  let mon = req.body["mon"];
  if (mon === "All") {
    fs.createReadStream(`../files/${loc}/${csv_file}`)
      .pipe(csv())
      .on("data", (row) => {
        let dict = {};
        Object.entries(row).forEach(([key, value]) => {
          dict[key.trim()] = value;
          if (key === "availability") {
            total_availabilites += parseInt(value);
          }
        });
        pieData.push(dict);
      })
      .on("end", () => {
        console.log("CSV file successfully processed and sent to frontend");
        res.send({ pieData: pieData, totalAvailabilites: total_availabilites });
        pieData = [];
        total_availabilites = 0;
      });
  } else {
    let arr = [];
    fs.createReadStream(`../files/${loc}/${csv_file}`)
      .pipe(csv())
      .on("data", (row) => {
        let dict = {};
        Object.entries(row).forEach(([key, value]) => {
          dict[key.trim()] = value;
        });
        arr.push(dict);
      })
      .on("end", () => {
        let final_data = arr[parseInt(mon)];
        delete final_data["Month"];
        Object.entries(final_data).forEach(([key, value]) => {
          total_availabilites += parseInt(value);
          let dict = {};
          dict["room_type"] = key;
          dict["availability"] = value;
          pieData.push(dict);
        });
        res.send({ pieData: pieData, totalAvailabilites: total_availabilites });
        console.log("CSV file successfully processed and sent to frontend");
        final_data = {};
        total_availabilites = 0;
        pieData = [];
      });
  }
});

app.listen(port);