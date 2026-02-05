import { useState } from "react";
import Navbar from "../Components/Navbar";
import FiltersTemp from "../Components/FiltersTemplate";
import ListTemp from "../Components/ListTemplate";

function Records() {
  const [filters, setFilters] = useState({
    team: "",
    match: "",
  });

  return (
    <div className="overflow-x-hidden flex flex-col items-center bg-[#ffffff]">
      <Navbar />
      <FiltersTemp filters={filters} setFilters={setFilters} />
      <ListTemp filters={filters} />
    </div>
  );
}
export default Records;
