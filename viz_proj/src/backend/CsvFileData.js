const express = require("express");
const csv = require("csv-parser");
const fs = require("fs");
const axios = require("axios");
const port = 4000;
const app = express();
let x = [];
let y = [];

app.use(express.json());

app.post("/csv/barChart", (req, res) => {
  console.log(req.body["csv"]);
  fs.createReadStream(`../files/${req.body["csv"]}`)
    .pipe(csv())
    .on("data", (row) => {
      console.log(row);
      Object.entries(row).forEach(([key, value]) => {
        if (key.trim() == "Month") {
          x.push(value);
        }
        if (key === "Availability") {
          y.push(value);
        }
      });
    })
    .on("end", () => {
      console.log("CSV file successfully processed");
      console.log(x);
      console.log(y);
      res.send({ yValues: y });
      x = [];
      y = [];
    });
});

app.post("/csv/barChart/month", (req, res) => {
  console.log(req.body["csv"]);
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
          y.push(value);
        }
      });
    })
    .on("end", () => {
      console.log("CSV file successfully processed");
      res.send({ "yValues": y, 'xValues': x });
      x = [];
      y = [];
    });
});

// fs.createReadStream("../files/daily.csv")
//   .pipe(csv())
//   .on("data", (row) => {
//     // console.log(row);
//     var push_availability = false;
//     Object.entries(row).forEach(([key, value]) => {
//       if (key.trim() == "Daily") {
//         if (value.split("/")[0] == "1") {
//           console.log(value);
//           x.push(value);
//           push_availability = true;
//         } 
//         // else {
//         //   res.send({ xValues: x, yValues: y });
//         // }
//       }
//       if (key === "Availability" && push_availability) {
//         y.push(value);
//         console.log(value);
//       }
//     });
//     res.send()
//   })
//   .on("end", () => {
//     console.log("CSV file successfully processed");
//   });

app.listen(port);
