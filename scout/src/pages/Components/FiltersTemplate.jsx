import { useState } from "react";

function Records() {
  const [count, setCount] = useState(0);

  return (
    // Search
    <div className="w-[60vw] bg-[#ffffff] flex flex-col text-[#000000] p-6 mt-5 rounded-[20px] border-2 border-[#E7E7E9]">
      <div className="flex gap-2 font-bold text-2xl items-center mb-4">
        <img src="/src/assets/icons8-pesquisar.png" className="w-8 h-8" />
        Filtros
      </div>

      <div className="flex justify-between gap-5">
        <input
          type="text"
          placeholder="Filtrar por time"
          className="w-[50%] px-4 py-2 rounded-lg border-2 border-[#E7E7E9]"
        />
        <input
          type="text"
          placeholder="Filtrar por partida"
          className="w-[50%] px-4 py-2 rounded-lg border-2 border-[#E7E7E9]"
        />
      </div>
    </div>

    // List
  );
}
export default Records;
