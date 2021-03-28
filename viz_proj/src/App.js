import BarChart from "./frontend/BarChart";
import "./App.css";

const App = () => {
  return (
    <div className="main d-flex flex-column">
      <div className="title-div d-flex justify-content-center align-items-center">
      <h1 className="title mt-4 mb-4 pd-4 ">
        When to Travel??
      </h1>
      </div>
      <div className="d-flex justify-content-center">
      <BarChart />
      </div>
    </div>
  );
};

export default App;
