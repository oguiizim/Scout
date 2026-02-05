import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  // 🔹 redireciona direto para o scout
  const handleEnter = () => {
    if (!username.trim() || !password.trim()) return;
    navigate("/scout/m");
  };

  return (
    <div className="font-nunito w-full min-h-screen flex items-center justify-center bg-[#ffffff]">
      <div className="text-black w-[30vw] min-w-[320px] max-w-[460px] flex flex-col items-center rounded-[20px] p-10 border-2 border-[#F1F5F9]">
        <div className="w-20 bg-[#E7E7E9] p-2 rounded-2xl my-2.5">
          <img src="/src/assets/Logo Axion.png" alt="Logo" />
        </div>

        <h1 className="text-2xl mt-2.5 font-bold">FRC Scout 2026</h1>
        <p className="text-[#262626] mb-2.5 mt-1">
          Rebuilt - Sistema de Scouting
        </p>

        {/* Usuário */}
        <p className="self-start font-semibold mt-2.5">Usuário</p>
        <input
          type="text"
          placeholder="Digite seu usuário"
          className="p-2 rounded-lg w-full border-2 border-[#F1F5F9] mt-2.5 mb-1"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Senha */}
        <p className="self-start font-semibold mt-2.5">Senha</p>
        <div className="grid grid-cols-[1fr_auto] items-center w-full">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Digite sua senha"
            className="p-2 rounded-lg w-full border-2 border-[#F1F5F9] mt-1 mb-2.5"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* 👁️ mostra senha SOMENTE enquanto pressionado */}
          <button
            type="button"
            onMouseDown={() => setShowPass(true)}
            onMouseUp={() => setShowPass(false)}
            onMouseLeave={() => setShowPass(false)}
            onTouchStart={() => setShowPass(true)}
            onTouchEnd={() => setShowPass(false)}
            className="mx-3 cursor-pointer"
            title="Mostrar senha"
            aria-label="Mostrar senha"
          >
            <img
              src="/src/assets/icons8-visivel.png"
              className="w-5 h-5"
              alt=""
            />
          </button>
        </div>

        {/* 🔥 BOTÃO ENTRAR */}
        <button
          type="button"
          onClick={handleEnter}
          className="w-full bg-[#0F172A] py-2 px-4 mb-4 rounded-lg hover:bg-[#141e37] transition-all duration-200 text-white"
        >
          Entrar
        </button>

        {/* 🔗 Cadastro */}
        <p className="text-sm">
          Não tem uma conta?{" "}
          <span
            onClick={() => navigate("/register")}
            className="underline underline-offset-2 cursor-pointer"
          >
            Crie sua conta aqui.
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
