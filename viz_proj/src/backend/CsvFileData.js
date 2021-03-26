const express = require("express");
const csv = require("csv-parser");
const fs = require("fs");
const axios = require("axios");
const port = 4000;
const app = express();
let x = [];
let y = [];

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

app.listen(port);
