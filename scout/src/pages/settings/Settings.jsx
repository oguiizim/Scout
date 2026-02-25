import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import useWorkspace from "../../context/UseWorkspace.jsx";
import toast from "react-hot-toast";
import { ChevronLeft, Cog } from "lucide-react";
import { joinWorkspaceByCode } from "../../api/services/workspace.js";

function Settings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const codeRef = useRef(null);

  const [joinCode, setJoinCode] = useState("");
  const [joining, setJoining] = useState(false);

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
    <div className="font-nunito min-h-screen w-full bg-background text-text">
      {/* container */}
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        {/* card */}
        <div className="w-full max-w-xl rounded-2xl border-2 border-border bg-background p-4 sm:p-6 lg:p-8">
          {/* header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-between gap-3">
              <div className="flex gap-3 items-center">
                <Cog size={30} />
                <h1 className="text-2xl font-bold sm:text-3xl">Settings</h1>
              </div>

              {/* se quiser colocar o toggle aqui */}
              {/* <DarkModeToggle /> */}
            </div>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full cursor-pointer rounded-lg transition-all duration-200 hover:scale-[1.02] hover:bg-lightblue sm:w-auto"
            >
              <div className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-border px-4 py-2 sm:w-auto">
                <ChevronLeft />
                <p className="text-lg font-semibold sm:text-xl">Sair</p>
              </div>
            </button>
          </div>

          {/* content */}
          <div className="mt-6 space-y-4">
            {/* Username */}
            <div className="flex flex-col">
              <p className="mb-2 text-lg font-semibold sm:text-xl">Usuario:</p>
              <div className="w-full rounded-lg border-2 border-border p-2">
                {typeof user === "string" ? user : (user?.username ?? "—")}
              </div>
            </div>

            {/* WorkspaceTeam */}
            <div className="flex flex-col">
              <p className="mb-2 text-lg font-semibold sm:text-xl">
                Workspace Team:
              </p>
              <div className="w-full rounded-lg border-2 border-border p-2">
                {loadingWorkspace ? "Carregando..." : workspaceTeam}
              </div>
            </div>

            {/* ShareCode */}
            <div className="flex flex-col">
              <p className="mb-2 text-lg font-semibold sm:text-xl">
                Share Code:
              </p>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="w-full rounded-lg border-2 border-border p-2 sm:w-[60%]">
                  {loadingWorkspace ? "Carregando..." : shareCode}
                </div>

                <button
                  onClick={handleCopy}
                  className="w-full cursor-pointer rounded-lg border-2 border-border bg-red-200 p-2 font-semibold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 sm:w-[40%]"
                  disabled={loadingWorkspace || shareCode === "—"}
                  title={
                    shareCode === "—"
                      ? "Sem código disponível"
                      : "Copiar código"
                  }
                >
                  Copiar Código
                </button>
              </div>
            </div>

            {/* Join via ShareCode */}
            <div className="flex flex-col">
              <p className="mb-2 text-lg font-semibold sm:text-xl">
                Entrar em Workspace via Share Code:
              </p>

              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  ref={codeRef}
                  type="text"
                  className="w-full rounded-lg border-2 border-border p-2 outline-none focus:ring-2 focus:ring-borderblue sm:w-[60%]"
                  placeholder="Cole o Share Code aqui"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                />

                <button
                  onClick={handleJoinWorkspace}
                  disabled={joining}
                  className="w-full cursor-pointer rounded-lg border-2 border-border bg-green-200 p-2 font-semibold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 sm:w-[40%]"
                >
                  {joining ? "Entrando..." : "Entrar em Workspace"}
                </button>
              </div>
            </div>

            {/* opcional: área pro DarkModeToggle no final */}
            {/* <div className="pt-2">
              <DarkModeToggle />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
