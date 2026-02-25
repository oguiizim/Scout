import { useState } from "react";
import Navbar from "../Components/Navbar";
import RankingTable from "../Components/RankingTable";
import TeamInfo from "../ranking/TeamInfo";

function Ranking() {
  

  return (
    <div className="overflow-x-hidden min-h-screen flex flex-col items-center bg-background">
      <Navbar />
      <RankingTable></RankingTable>
    </div>
  );
}
export default Ranking;
