import BarChart from "./frontend/BarChart/BarChart";
import "./App.css";
import PieChartValues from "./frontend/PieChart/PieChartValues";

const App = () => {
  return (
    <div className="main d-flex flex-column p-2">
      <div className="title-div d-flex justify-content-center align-items-center">
        <h1 className="title mt-4 mb-4 pd-4 ">When to Travel??</h1>
      </div>
      <div className="d-flex justify-content-center">
        <BarChart />
      </div>
      <div className="d-flex justify-content-center" style={{minHeight: '600px'}}>
        <PieChartValues />
      </div>
    </div>
  );
};

export default App;
