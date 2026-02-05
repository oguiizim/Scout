import { useState } from "react";
import Navbar from "../Components/Navbar";
import FiltersTemp from "../Components/FiltersTemplate";
import ListTemp from "../Components/ListTemplate";

function Records() {
  const [count, setCount] = useState(0);

  return (
    <div className="overflow-x-hidden flex flex-col items-center bg-[#ffffff]">
      <Navbar></Navbar>
      <FiltersTemp></FiltersTemp>
      <ListTemp></ListTemp>
    </div>
  );
}
export default Records;
