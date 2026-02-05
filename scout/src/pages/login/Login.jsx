import { useState } from "react";

function Login() {
  const [count, setCount] = useState(0);

  return (
    <div className="font-nunito w-full min-h-screen flex items-center justify-center bg-[#ffffff]">
      <div className="text-black w-[30vw] flex flex-col items-center rounded-[20px] p-10 border-2 border-[#F1F5F9]">
        <div className="w-20 bg-[#E7E7E9] p-2 rounded-2xl my-2.5">
          <img src="/src/assets/Logo Axion.png" alt="Logo" />
        </div>

        <h1 className="text-2xl text-black mt-2.5 font-bold">FRC Scout 2026</h1>
        <p className="text-[#262626] mb-2.5 mt-1">
          Rebuilt - Sistema de Scouting
        </p>

        <p className="self-start text-black mt-2.5 font-semibold">Usuário</p>
        <input
          type="text"
          placeholder="Digite seu usuário"
          className="p-2  rounded-lg bg-[#ffffff] text-black w-full border-2 border-[#F1F5F9] mt-2.5 mb-1"
        />

        <div className="grid grid-cols-[1fr_auto] items-center w-full">
          <input
            type="password"
            placeholder="Digite sua senha"
            className="p-2  rounded-lg text-black w-full border-2 border-[#F1F5F9] mt-1 mb-2.5"
          />
          <img
            src="/src/assets/icons8-visivel.png"
            className="w-5 h-5 justify-self-end mx-3 cursor-pointer"
          />
        </div>

        <div className="w-full bg-[#0F172A] py-2 px-4 mb-4 rounded-lg hover:bg-[#141e37] transition-all duration-200">
          <button className="w-full items-center text-white ">Entrar</button>
        </div>

        <p>
          Não tem uma conta?{" "}
          <a href="" className="underline underline-offset-2">
            Crie sua conta aqui.
          </a>
        </p>
      </div>
    </div>
  );
}
export default Login;
