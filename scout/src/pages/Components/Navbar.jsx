import { useState } from "react";

function Navbar() {
  const [count, setCount] = useState(0);

  return (
    <nav className="font-nunito min-w-screen flex justify-between border-b-2 border-[#E7E7E9] bg-[#ffffff] px-40 text-black">
      {/* Itens of navigator */}

      {/* Name of the product */}
      <div className="flex justify-start items-center gap-5 text-xl font-bold">
        <div className="h-10 w-10">
          <img src="/src/assets/icons8-bot.png" />
        </div>
        FRC Scout 2026
      </div>

      {/* List of links */}
      <ul className="flex justify-center items-center gap-4 m-4">
        <li className="justify-center flex rounded-md p-2.5 px-4 hover:bg-[#F1F5F9] hover:scale-105 transition-all duration-200">
          <a href="">Scouting de Partidas</a>
        </li>
        <li className="justify-center flex rounded-md p-2.5 px-4 hover:bg-[#F1F5F9] hover:scale-105 transition-all duration-200">
          <a href="">Scouting de Pit</a>
        </li>
        <li className="justify-center flex rounded-md p-2.5 px-4 hover:bg-[#F1F5F9] hover:scale-105 transition-all duration-200">
          <a href="">Registros</a>
        </li>
        <li className="justify-center flex rounded-md p-2.5 px-4 hover:bg-[#F1F5F9] hover:scale-105 transition-all duration-200">
          <a href="">Dashboard</a>
        </li>
      </ul>

      {/* Logout */}
      <div className="flex justify-end items-center gap-5 mr-5 text-lr text-[#b6b6b6]">
        oguizim
        <button className="w-10 h-10 cursor-pointer">
          <img src="./src/assets/icons8-sair.png" />
        </button>
      </div>
    </nav>
  );
}
export default Navbar;
