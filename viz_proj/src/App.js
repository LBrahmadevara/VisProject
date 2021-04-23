import BarChart from "./frontend/BarChart/BarChart";
import "./App.css";
import PieChartValues from "./frontend/PieChart/PieChartValues";
import LineChartValues from "./frontend/LineChart/LineChartValues";
import StackedBarChartValues from "./frontend/StackedBarChart/StackedBarChartValues";
import GroupedBarChartValues from "./frontend/GroupedBarChart/GroupedBarChartValues";

const App = () => {
  return (
    <div className="main d-flex flex-column p-2">
      <div className="title-div d-flex justify-content-center align-items-center">
        <h1 className="title mt-4 mb-4 pd-4 ">When to Travel??</h1>
      </div>
      <div className="d-flex justify-content-center">
        <BarChart />
      </div>
      <div
        className="d-flex justify-content-center pb-2"
        style={{ minHeight: "600px" }}
      >
        <PieChartValues />
      </div>
      <div className="d-flex justify-content-center pt-4 pb-2">
        <GroupedBarChartValues />
      </div>
      <div className="d-flex justify-content-center pb-4">
        <LineChartValues />
      </div>
      {/* <div className="d-flex justify-content-center pt-4 pb-4">
        <StackedBarChartValues />
      </div> */}
    </div>
  );
};

export default App;
