import { useState } from "react";
import Navbar from "../Components/Navbar";
import ScoutPForm from "../Components/ScoutPForm"

function ScoutP() {
  const [count, useCount] = useState(0);

  return (
    <div className="overflow-x-hidden flex flex-col items-center bg-background">
      <Navbar></Navbar>
      <ScoutPForm></ScoutPForm>
    </div>
  );
}
export default ScoutP;
