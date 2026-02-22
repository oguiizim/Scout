import { useState } from "react";
import { useWorkspace } from "../../context/UseWorkspace.jsx";

export default function InviteCodeButton() {
  const { activeWorkspace, loadingWorkspace } = useWorkspace();
  const [open, setOpen] = useState(false);

  if (loadingWorkspace) {
    return (
      <button className="px-3 py-2 rounded-lg bg-white/10 opacity-60" disabled>
        Carregando...
      </button>
    );
  }

  const code = activeWorkspace?.shareCode;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15"
        disabled={!code}
        title={
          !code ? "Sem workspace ativo ou sem shareCode" : "Mostrar código"
        }
      >
        Mostrar código
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b0d10] p-5 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Código do Workspace</h3>
                <p className="text-sm opacity-70">
                  Compartilhe este código para alguém entrar no seu workspace.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 rounded-xl bg-black/30 border border-white/10 p-3">
              <p className="text-xs opacity-70">Workspace ativo</p>
              <p className="text-sm">{activeWorkspace?.name ?? "—"}</p>

              <p className="mt-3 text-xs opacity-70">ShareCode</p>
              <code className="mt-1 inline-block text-base font-semibold tracking-wider">
                {code ?? "—"}
              </code>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={async () => {
                  if (!code) return;
                  await navigator.clipboard.writeText(code);
                  alert("Código copiado!");
                }}
                className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15"
                disabled={!code}
              >
                Copiar
              </button>
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
