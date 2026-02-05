import { useState } from "react";
import Navbar from "../Components/Navbar";
import RankingTable from "../Components/RankingTable";
import TeamInfo from "../ranking/TeamInfo";

function Ranking() {
  const [filters, setFilters] = useState({
    team: "",
    match: "",
  });

  return (
    <div className="overflow-x-hidden flex flex-col items-center bg-[#ffffff]">
      <Navbar />
      <RankingTable></RankingTable>
    </div>
  );
}
export default Ranking;
