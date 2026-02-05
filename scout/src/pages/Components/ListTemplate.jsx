import { useEffect, useMemo, useState } from "react";

function ListTemplate({ filters }) {
  const STORAGE_KEY = "scout_records";

  const [records, setRecords] = useState([]);
  const [selected, setSelected] = useState(null);

  const load = () => {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setRecords(Array.isArray(data) ? data : []);
    } catch {
      setRecords([]);
    }
  };

  useEffect(() => {
    load();

    // Atualiza quando salvar em outra tela/aba
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) load();
    };
    window.addEventListener("storage", onStorage);

    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Ordena por data mais recente
  const sorted = useMemo(() => {
    return [...records].sort((a, b) => {
      const da = new Date(a.createdAt || 0).getTime();
      const db = new Date(b.createdAt || 0).getTime();
      return db - da;
    });
  }, [records]);

  // ✅ aplica filtros (time e partida)
  const filtered = useMemo(() => {
    const teamQ = (filters?.team || "").trim().toLowerCase();
    const matchQ = (filters?.match || "").trim();

    return sorted.filter((r) => {
      const teamText =
        `${r.teamName || ""} #${r.teamNumber || ""}`.toLowerCase();
      const matchText = String(r.matchNumber ?? "");

      const okTeam = !teamQ || teamText.includes(teamQ);
      const okMatch = !matchQ || matchText.includes(matchQ);

      return okTeam && okMatch;
    });
  }, [sorted, filters]);

  const formatPos = (p) => {
    if (p === "left") return "Esquerda";
    if (p === "center") return "Centro";
    if (p === "right") return "Direita";
    return "-";
  };

  const formatLvl = (v) => {
    if (v === "none") return "Nenhum";
    if (v === "l1") return "N1";
    if (v === "l2") return "N2";
    if (v === "l3") return "N3";
    return "-";
  };

  const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("pt-BR");
  };

  const formatTeam = (r) => {
    if (r?.teamNumber) return `#${r.teamNumber}`;
    return "-";
  };

  const removeRecord = (id) => {
    const next = records.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setRecords(next);
    if (selected?.id === id) setSelected(null);
  };
  const gridCols =
    "grid-cols-[100fr_100fr_100fr_100fr_100fr_100fr_120fr_120fr_100fr]";

  const cell = "flex items-center justify-center";

  return (
    <>
      <div className="w-[70vw] bg-[#ffffff] flex flex-col text-[#000000] p-6 mt-5 mb-5 rounded-[20px] border-2 border-[#E7E7E9]">
        <div className="flex items-center justify-between mb-4">
          {/* ✅ mostra filtrados / total */}
          <h1 className="text-2xl font-bold">
            Registros ({filtered.length}/{sorted.length})
          </h1>

          <button
            type="button"
            onClick={load}
            className="rounded-lg px-4 py-2 border-2 border-[#E7E7E9] hover:bg-[#F1F5F9] transition-all duration-200"
            title="Recarregar"
          >
            Atualizar
          </button>
        </div>

        {/* Header */}
        <div
          className={`w-full font-semibold grid ${gridCols} text-[#2e2e2e] pb-2 border-b border-[#2e2e2e]`}
        >
          <p className={cell}>Partida</p>
          <p className={cell}>Time</p>
          <p className={cell}>Posição</p>
          <p className={cell}>Ciclos</p>
          <p className={cell}>Quebrou</p>
          <p className={cell}>Endgame</p>
          <p className={cell}>Scout</p>
          <p className={cell}>Data</p>
          <p className={cell}>Ações</p>
        </div>

        {/* Body */}
        <div className="w-full flex flex-col">
          {filtered.map((r) => (
            <div
              key={r.id}
              className={`w-full grid ${gridCols} py-3 border-b border-[#E7E7E9]`}
            >
              <p className={cell}>{r.matchNumber ?? "-"}</p>

              <p className={`${cell} break-words leading-tight`}>
                {formatTeam(r)}
              </p>

              <p className={cell}>{formatPos(r.startPos)}</p>

              <p className={cell}>
                {(r.autoCycles ?? 0) + (r.teleopCycles ?? 0)}
              </p>

              <p className={cell}>{r.robotBroke ? "Sim" : "Não"}</p>

              <p className={cell}>{formatLvl(r.endgame)}</p>

              <p className={cell}>{r.scoutName || "oguizim"}</p>

              <p className={cell}>{formatDate(r.createdAt)}</p>

              <div className={`${cell} gap-2 flex flex-col`}>
                <button
                  type="button"
                  onClick={() => setSelected(r)}
                  className="w-20 rounded-lg px-3 py-1 border-2 border-[#E7E7E9] hover:bg-[#F1F5F9] transition-all duration-200"
                >
                  Exibir
                </button>

                <button
                  type="button"
                  onClick={() => removeRecord(r.id)}
                  className="w-20 rounded-lg px-3 py-1 border-2 border-[#E7E7E9] hover:bg-[#F1F5F9] transition-all duration-200"
                  title="Excluir"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal melhorado */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-[55vw] bg-white rounded-[20px] border-2 border-[#E7E7E9] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-black">
                  {selected.teamName
                    ? `${selected.teamName} #${selected.teamNumber}`
                    : `Equipe #${selected.teamNumber}`}
                </h2>

                <div className="flex gap-6 text-[#2e2e2e]">
                  <p>
                    <span className="font-semibold text-black">Partida:</span>{" "}
                    {selected.matchNumber}
                  </p>
                  <p>
                    <span className="font-semibold text-black">Scout:</span>{" "}
                    {selected.scoutName || "oguizim"}
                  </p>
                  <p>
                    <span className="font-semibold text-black">Data:</span>{" "}
                    {formatDate(selected.createdAt)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-black rounded-lg px-4 py-2 border-2 border-[#E7E7E9] hover:bg-[#F1F5F9] transition-all duration-200"
              >
                Fechar
              </button>
            </div>

            {/* Body */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-[#2e2e2e]">
              <div>
                <p className="font-semibold text-black">Posição Inicial</p>
                <p>{formatPos(selected.startPos)}</p>
              </div>

              <div>
                <p className="font-semibold text-black">Tempo Médio/Ciclo</p>
                <p>{selected.avgCycleSec || "-"}</p>
              </div>

              <div>
                <p className="font-semibold text-black">Auto Cycles</p>
                <p>{selected.autoCycles ?? 0}</p>
              </div>

              <div>
                <p className="font-semibold text-black">Teleop Cycles</p>
                <p>{selected.teleopCycles ?? 0}</p>
              </div>

              <div>
                <p className="font-semibold text-black">Quebrou</p>
                <p>{selected.robotBroke ? "Sim" : "Não"}</p>
              </div>

              <div>
                <p className="font-semibold text-black">Auto OK</p>
                <p>{selected.autoWorked ? "Sim" : "Não"}</p>
              </div>

              <div>
                <p className="font-semibold text-black">Endgame</p>
                <p>{formatLvl(selected.endgame)}</p>
              </div>

              <div>
                <p className="font-semibold text-black">Escalado no Auto</p>
                <p>{formatLvl(selected.autoClimb)}</p>
              </div>

              <div className="col-span-2">
                <p className="font-semibold text-black">Observações</p>
                <p className="wrap-break-word">{selected.notes || "-"}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => removeRecord(selected.id)}
                className="text-black rounded-lg px-4 py-2 border-2 border-[#E7E7E9] hover:bg-[#F1F5F9] transition-all duration-200"
              >
                Excluir
              </button>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg px-6 py-2 bg-[#0F172A] text-white hover:bg-[#141e37] transition-all duration-200"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ListTemplate;
