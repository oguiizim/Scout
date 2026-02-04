import { useState } from "react";

function Scout() {
  const [count, setCount] = useState(0);

  return (
    <div className="font-nunito w-full min-h-screen bg-[#242424]">
      {/* Navigator */}
      <nav className="min-w-screen flex justify-between bg-[rgb(18,18,18)] px-40">
        {/* Itens of navigator */}

        {/* Name of the product */}
        <div className="flex justify-start items-center gap-5 text-xl">
          <div className="h-10 w-10">
            <img src="/src/assets/icons8-bot.png" />
          </div>
          FRC Scout 2026
        </div>

        {/* List of links */}
        <ul className="flex justify-center items-center gap-4 m-4">
          <li className="justify-center flex rounded-md p-2.5 px-4 hover:bg-[#3a3a3a] hover:scale-105 transition-all duration-200">
            <a href="">Scouting</a>
          </li>
          <li className="justify-center flex rounded-md p-2.5 px-4 hover:bg-[#3a3a3a] hover:scale-105 transition-all duration-200">
            <a href="">Registros</a>
          </li>
          <li className="justify-center flex rounded-md p-2.5 px-4 hover:bg-[#3a3a3a] hover:scale-105 transition-all duration-200">
            <a href="">Dashboard</a>
          </li>
        </ul>

        {/* Logout */}
        <div className="flex justify-end items-center gap-5 mr-5 text-lr text-[#adadad]">
          oguizim
          <button className="w-10 h-10 cursor-pointer">
            <img src="./src/assets/icons8-sair.png" />
          </button>
        </div>
      </nav>
    </div>
  );
}
export default Scout;
