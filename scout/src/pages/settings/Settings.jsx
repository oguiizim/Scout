import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import useWorkspace from "../../context/UseWorkspace.jsx";
import toast from "react-hot-toast";
import back from "../../assets/icons8-voltar.png";
import { joinWorkspaceByCode } from "../../api/services/workspace.js";

function Settings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const codeRef = useRef(null);

  const [joinCode, setJoinCode] = useState("");
  const [joining, setJoining] = useState(false);

  // ✅ pegue refreshActiveWorkspace do seu hook
  const { activeWorkspace, loadingWorkspace, refreshActiveWorkspace } =
    useWorkspace();

  const handleJoinWorkspace = async () => {
    const code = joinCode.trim();
    if (!code) return toast.error("Digite um Share Code válido.");

    setJoining(true);
    try {
      await joinWorkspaceByCode(code, true);
      await refreshActiveWorkspace();
      toast.success("Você entrou no workspace!");
      setJoinCode("");
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        (typeof e?.response?.data === "string" ? e.response.data : "") ||
        "Não foi possível entrar no workspace.";
      toast.error(String(msg));
    } finally {
      setJoining(false);
    }
  };

  const workspaceTeam =
    activeWorkspace?.team?.name ||
    activeWorkspace?.teamName ||
    activeWorkspace?.name ||
    "—";

  const shareCode =
    activeWorkspace?.shareCode || activeWorkspace?.inviteCode || "—";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(shareCode ?? ""));
      toast.success("Código copiado com sucesso!");
    } catch (e) {
      toast.error("Não foi possível copiar.");
    }
  };

  return (
    <div className="font-nunito w-full min-h-screen text-black flex items-center justify-center bg-[#ffffff]">
      <div className="w-[25%] border-2 border-[#F1F5F9] rounded-2xl p-5 flex flex-col items-center">
        <div className="flex justify-between items-center w-[80%]">
          <h1 className="font-bold text-2xl">Settings</h1>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="cursor-pointer hover:scale-105 hover:bg-[#F1F5F9] hover:rounded-lg transition-all duration-200"
          >
            <div className="flex gap-2 border-2 border-[#F1F5F9] rounded-lg py-2 px-4 items-center">
              <img src={back} alt="" className="w-5 h-5" />
              <p className="font-semibold text-xl">Sair</p>
            </div>
          </button>
        </div>

        {/* Username */}
        <div className="flex flex-col w-full my-1">
          <p className="justify-self-start font-semibold text-xl mb-2">
            Usuario:
          </p>
          <div className="w-full p-2 rounded-lg border-2 border-[#F1F5F9]">
            {typeof user === "string" ? user : (user?.username ?? "—")}
          </div>
        </div>

        {/* WorkspaceTeam */}
        <div className="flex flex-col w-full my-1">
          <p className="justify-self-start font-semibold text-xl mb-2">
            Workspace Team:
          </p>
          <div className="w-full p-2 rounded-lg border-2 border-[#F1F5F9]">
            {loadingWorkspace ? "Carregando..." : workspaceTeam}
          </div>
        </div>

        {/* ShareCode */}
        <div className="flex flex-col w-full my-1">
          <p className="font-semibold text-xl mb-2">Share Code:</p>

          <div className="flex flex-row w-full gap-2">
            <div className="w-[60%] p-2 rounded-lg border-2 border-[#F1F5F9]">
              {loadingWorkspace ? "Carregando..." : shareCode}
            </div>

            <button
              onClick={handleCopy}
              className="w-[40%] p-2 rounded-lg bg-red-200 border-2 border-[#F1F5F9] cursor-pointer flex items-center justify-center font-semibold hover:scale-105 transition"
              disabled={loadingWorkspace || shareCode === "—"}
              title={
                shareCode === "—" ? "Sem código disponível" : "Copiar código"
              }
            >
              Copiar Código
            </button>
          </div>
        </div>

        {/* Join via ShareCode */}
        <div className="flex flex-col w-full my-1">
          <p className="font-semibold text-xl mb-2">
            Entrar em Workspace via Share Code:
          </p>

          <div className="flex flex-row w-full gap-2">
            <input
              ref={codeRef}
              type="text"
              className="w-[60%] p-2 rounded-lg border-2 border-[#F1F5F9]"
              placeholder="Cole o Share Code aqui"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />

            <button
              onClick={handleJoinWorkspace}
              disabled={joining}
              className="w-[40%] p-2 rounded-lg bg-green-200 border-2 border-[#F1F5F9] cursor-pointer flex items-center justify-center font-semibold hover:scale-105 transition disabled:opacity-60 disabled:hover:scale-100"
            >
              {joining ? "Entrando..." : "Entrar em Workspace"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
