import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    if (!username || !password || !confirm) return;
    if (password !== confirm) {
      alert("As senhas não coincidem");
      return;
    }

    // futuramente: salvar no backend
    navigate("/login"); // volta para login após cadastro
  };

  return (
    <div className="font-nunito w-full min-h-screen flex items-center justify-center bg-[#ffffff]">
      <form
        onSubmit={handleRegister}
        className="text-black w-[30vw] min-w-[320px] max-w-115 flex flex-col items-center rounded-[20px] p-10 border-2 border-[#F1F5F9]"
      >
        <h1 className="text-2xl font-bold mb-2">Criar Conta</h1>
        <p className="text-[#262626] mb-6">Cadastro no sistema FRC Scout</p>
        <p className="self-start font-semibold">Time</p>
        <input
          className="p-2 rounded-lg w-full border-2 border-[#F1F5F9] mt-2 mb-4"
          placeholder="Digite seu time"
          value={username}
        />

        <p className="self-start font-semibold">Usuário</p>
        <input
          className="p-2 rounded-lg w-full border-2 border-[#F1F5F9] mt-2 mb-4"
          placeholder="Digite seu usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <p className="self-start font-semibold">Senha</p>
        <input
          type="password"
          className="p-2 rounded-lg w-full border-2 border-[#F1F5F9] mt-2 mb-4"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <p className="self-start font-semibold">Confirmar Senha</p>
        <input
          type="password"
          className="p-2 rounded-lg w-full border-2 border-[#F1F5F9] mt-2 mb-6"
          placeholder="Confirme sua senha"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-[#0F172A] py-2 rounded-lg text-white hover:bg-[#141e37] cursor-pointer"
        >
          Criar Conta
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mt-4 underline text-sm cursor-pointer"
        >
          Voltar para login
        </button>
      </form>
    </div>
  );
}

export default Register;
