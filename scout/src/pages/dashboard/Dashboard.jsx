import { useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import DashboardTemp from "../Components/DashboardTemplate";

function Dashboard() {
  return (
    <div className="overflow-x-hidden flex flex-col items-center bg-[#ffffff]">
      <Navbar></Navbar>
      <DashboardTemp></DashboardTemp>
    </div>
  );
}
export default Dashboard;
