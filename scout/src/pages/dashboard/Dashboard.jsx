import { useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import DashboardTemp from "../Components/DashboardTemplate";

function Dashboard() {
  return (
    <div className="overflow-x-hidden min-h-screen flex flex-col items-center bg-background">    
      <Navbar></Navbar>
      <DashboardTemp></DashboardTemp>
    </div>
  );
}
export default Dashboard;
