import Navbar from "../Components/Navbar";
import ScoutMForm from "../Components/ScoutMForm";

function ScoutM() {
  return (
    <div className="overflow-x-hidden flex flex-col items-center bg-[#ffffff] min-h-screen">
      <Navbar />
      <ScoutMForm />
    </div>
  );
}

export default ScoutM;
