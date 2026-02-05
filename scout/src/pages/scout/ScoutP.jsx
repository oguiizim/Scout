import { useState } from "react";
import Navbar from "../Components/Navbar";
import ScoutPForm from "../Components/ScoutPForm"

function ScoutP() {
  const [count, useCount] = useState(0);

  return (
    <div className="overflow-x-hidden flex flex-col items-center bg-[#ffffff]">
      <Navbar></Navbar>
      {/* <ScoutMForm className="flex items-center justify-center"></ScoutMForm> */}
      <ScoutPForm></ScoutPForm>
    </div>
  );
}
export default ScoutP;
