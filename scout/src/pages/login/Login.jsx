import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logoAxion from "../../assets/Logo Axion.png";
import eyeIcon from "../../assets/icons8-visivel.png";
import { loginUser } from "../../api/services/login.js";
import { useAuth } from "../../context/AuthContext.jsx";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  navigate(from, { replace: true });

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  // 🔹 redireciona direto para o scout
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await loginUser({
        username: form.username.trim(),
        password: form.password,
      });

      console.log("HEADERS:", res.headers);

      // ✅ pega o token do header Authorization
      const authHeader = res.headers.authorization;

      if (!authHeader) {
        toast.error("Token não encontrado na resposta.");
        return;
      }

      const token = authHeader.replace("Bearer ", "");
      localStorage.setItem("token", token);

      toast.success("Login realizado!");
      login(token);
      navigate("/home");
    } catch (err) {
      console.error(err);
      toast.error("Usuário ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="font-nunito w-full min-h-screen flex items-center justify-center bg-[#ffffff]">
      <div className="text-black w-[30vw] min-w-[320px] max-w-115 flex flex-col items-center rounded-[20px] p-5 border-2 border-[#F1F5F9]">
        <div className="w-20 bg-[#E7E7E9] p-2 rounded-2xl my-2.5">
          <img src={logoAxion} alt="Logo" />
        </div>

        <h1 className="text-2xl mt-2.5 font-bold">FRC Scout 2026</h1>
        <p className="text-[#262626] mb-2.5 mt-1">
          Rebuilt - Sistema de Scouting
        </p>

        <form onSubmit={handleSubmit} className="w-full">
          {/* Usuário */}
          <p className="self-start font-semibold mt-2.5">Usuário</p>
          <input
            className="p-2 rounded-lg w-full border-2 border-[#F1F5F9] mt-2.5 mb-1"
            type="text"
            placeholder="Digite seu usuário"
            name="username"
            value={form.username}
            onChange={handleChange}
          />

          {/* Senha */}
          <p className="self-start font-semibold mt-2.5">Senha</p>
          <div className="grid grid-cols-[1fr_auto] items-center w-full">
            <input
              className="p-2 rounded-lg w-full border-2 border-[#F1F5F9] mt-1 mb-2.5"
              type={showPass ? "text" : "password"}
              placeholder="Digite sua senha"
              name="password"
              value={form.password}
              onChange={handleChange}
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
              <img src={eyeIcon} className="w-5 h-5" alt="Mostrar senha" />
            </button>
          </div>

          {/* 🔥 BOTÃO ENTRAR */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0F172A] py-2 px-4 mb-4 rounded-lg hover:bg-[#141e37] transition-all duration-200 text-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

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
