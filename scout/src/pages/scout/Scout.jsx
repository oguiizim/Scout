import { useState } from "react";
import Navbar from "../Components/Navbar";
import ScoutMForm from "../Components/ScoutMForm";

function Scout() {
  const [count, setCount] = useState(0);

  return (
    <div className="overflow-x-hidden flex flex-col items-center bg-[#ffffff]">
      <Navbar></Navbar>
      <ScoutMForm className="flex items-center justify-center"></ScoutMForm>
    </div>
  );
}
export default Scout;
