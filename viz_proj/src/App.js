import BarChart from "./frontend/BarChart";
import "./App.css";

const App = () => {
  return (
    <div className="main d-flex flex-column">
      <div className="title-div d-flex justify-content-center align-items-center">
      <h2 className="title mt-4 mb-4 pd-4 ">
        Interactive Visualization tool to decide the best time to Travel
      </h2>
      </div>
      <div className="d-flex justify-content-center">
      <BarChart />
      </div>
    </div>
  );
};

export default App;
