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
let lineData = [];
let groupedColData = [];

app.use(express.json());

// Logic for Bar Chart
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
        console.log("Pie Data processed and sent to frontend");
        final_data = {};
        total_availabilites = 0;
        pieData = [];
      });
  }
});

// Logic for Line Chart
app.post("/csv/lineChart", (req, res) => {
  let sd = [];
  let sf = [];
  let data = {};
  fs.createReadStream(`../files/${req.body["csv"]}`)
    .pipe(csv())
    .on("data", (row) => {
      let sfValues = {};
      let sdValues = {};
      Object.entries(row).forEach(([key, value]) => {
        if (key.trim() == "Month") {
          sfValues["Month"] = value;
          sdValues["Month"] = value;
        }
        if (key.trim() === "San Francisco") {
          sfValues["Availability"] = value;
          sf.push(sfValues);
        }
        if (key.trim() === "San Diego") {
          sdValues["Availability"] = value;
          sd.push(sdValues);
        }
      });
    })
    .on("end", () => {
      data["city"] = "San Francisco";
      data["values"] = sf;
      lineData.push(data);
      data = {};
      data["city"] = "San Diego";
      data["values"] = sd;
      lineData.push(data);
      res.send({ lineData: lineData });
      console.log("Line Data processed and sent to frontend");
      sd = [];
      sf = [];
      data = {};
      lineData = [];
    });
});


// logic for Grouped Column Bar Chart
app.post("/csv/groupCol", (req, res) => {
  fs.createReadStream(`../files/${req.body["loc"]}/${req.body["csv"]}`)
  .pipe(csv())
  .on("data", (row) => {
    let dic = {};
    Object.entries(row).forEach(([key, value]) => {
      if (key.trim() === "Month") {
        dic[key.trim()] = value;
      } else {
        dic[key] = parseFloat(value);
      }
    });
    groupedColData.push(dic);
  })
  .on("end", () => {
    res.send({data: groupedColData})
    console.log("Line Data processed and sent to frontend");
    groupedColData = [];
  });

})

app.listen(port);
