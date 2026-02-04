import { useState } from "react";

function Login() {
  const [count, setCount] = useState(0);

  return (
    <div className="font-nunito w-full min-h-screen flex items-center justify-center bg-[#242424]">
      <div className="w-[40vw] flex flex-col items-center bg-[rgb(18,18,18)] rounded-2xl p-10">
        <div className="w-20 bg-[#adadad] p-2 rounded-2xl my-2.5">
          <img src="/src/assets/icons8-bot.png" alt="Logo" />
        </div>

        <h1 className="text-2xl text-white mt-2.5">FRC Scout 2026</h1>
        <p className="text-[#adadad] mb-2.5 mt-1">
          Rebuilt - Sistema de Scouting
        </p>

        <p className="self-start text-[#adadad] mt-2.5">Usuário</p>
        <div className="w-full rounded-lg bg-[#333333] my-2.5">
          <input
            type="text"
            placeholder="Digite seu usuário"
            className="p-2 rounded-lg bg-[#333333] text-white w-full"
          />
        </div>

        <div className="w-full bg-[#19195E] py-2 px-4 rounded-lg hover:bg-[#2E2EAB] transition-all duration-200">
          <button className="w-full items-center text-white ">Entrar</button>
        </div>
      </div>
    </div>
  );
}
export default Login;
