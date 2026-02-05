import { useState } from "react";

function ListTemplate() {
  const [count, setCount] = useState(0);

  return (
    <div className="w-[60vw] bg-[#ffffff] flex flex-col text-[#000000] p-6 mt-5 mb-5 rounded-[20px] border-2 border-[#E7E7E9]">
      <h1 className="text-2xl font-bold mb-4">Registros (var)</h1>

      <div className="w-full flex justify-between gap-10 text-[#2e2e2e] pb-2 border-b border-[#2e2e2e] ">
        <p>Partida</p>
        <p>Time</p>
        <p>Posição</p>
        <p>Ciclos</p>
        <p>Quebrou</p>
        <p>Endgame</p>
        <p>Scout</p>
        <p>Data</p>
        <p>Ações</p>
      </div>
    </div>
  );
}
export default ListTemplate;
