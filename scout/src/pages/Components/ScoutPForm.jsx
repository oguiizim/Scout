import { useState } from "react";

function ScoutForm() {
  const [count, setCount] = useState(0);

  return (
    <div className="w-[40vw] bg-[#ffffff] flex flex-col text-[#000000] p-6 mt-5 mb-5 rounded-[20px] border-2 border-[#E7E7E9]">
      {/* Title */}
      <h1 className="font-bold text-2xl justify-start mb-4">Novo Scout</h1>

      {/* Team Number and Robot Name */}
      <div className="flex flex-row justify-between gap-5 mb-4">
        <div className="w-[50%] flex flex-col mb-3.5 font-semibold">
          <h1 className="mb-3.5">Nº do Time:</h1>
          <input
            type="text"
            placeholder="Ex: 254"
            className="w-full px-4 py-2 rounded-lg border-2 border-[#E7E7E9]"
          />
        </div>

        <div className="w-[50%] flex mb-3.5 font-semibold">
          <h1>Nome do robô:</h1>
          <input type="text" />
        </div>
      </div>
    </div>
  );
}
export default ScoutForm;
