import { BrowserRouter } from "react-router-dom";
import Dashboard from "./Dashboard";

function DashboardWrapper() {
  return (
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );
}

export default DashboardWrapper;