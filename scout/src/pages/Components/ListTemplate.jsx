import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getMyScoutMatches } from "../../api/services/getMatchesUser.js";
import { deleteScoutMatch } from "../../api/services/deleteScoutMatch.js";
import { TEAMS } from "../../data/Teams.js";
import { ChartLine, Maximize2, Trash } from "lucide-react";
import useWorkspace from "../../context/UseWorkspace.jsx";
import grafico_gif from "../../assets/graph-gif.gif";
import grafico from "../../assets/graph.png";

function ListTemplate({ filters }) {
  const { activeWorkspace } = useWorkspace();
  const [records, setRecords] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ helper: pega nome do time pelo número
  const getTeamName = (teamNumber) => {
    const num = Number(teamNumber);
    if (!Number.isFinite(num)) return null;
    const team = TEAMS.find((t) => Number(t.number) === num);
    return team?.name ?? null;
  };

  // ✅ normaliza o retorno do backend pro formato do seu layout antigo
  const normalize = (r) => {
    const teamNumber = r.teamNumber ?? r.team; // backend usa "team"
    const matchNumber = r.matchNumber;

    return {
      ...r,
      id: r.id ?? `${teamNumber}-${matchNumber}-${r.createdAt ?? ""}`,

      teamNumber,
      startPos: r.startPos ?? r.position,

      autoCycles: r.autoCycles ?? r.autoCyles ?? 0,
      teleopCycles: r.teleopCycles ?? r.teleCycles ?? 0,

      robotBroke: r.robotBroke ?? r.areBroke ?? false,
      autoWorked: r.autoWorked ?? r.autoWork ?? false,

      endgame: r.endgame ?? r.towerEnd ?? "none",
      autoClimb: r.autoClimb ?? r.towerAuto ?? "none",

      // 👇 se quiser ter pronto:
      teamName: r.teamName ?? getTeamName(teamNumber) ?? "",
    };
  };

  // ✅ carrega 1x (não precisa recarregar a cada filtro)
  const load = async () => {
    try {
      setLoading(true);

      const data = await getMyScoutMatches();
      const list = Array.isArray(data) ? data.map(normalize) : [];

      setRecords(list);
      setSelected(null);
    } catch (err) {
      console.log(
        "load records error:",
        err?.response?.status,
        err?.response?.data,
      );
      toast.error("Erro ao carregar registros.");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeWorkspace?.id]);

  // Ordena por data mais recente
  const sorted = useMemo(() => {
    return [...records].sort((a, b) => {
      const da = new Date(a.createdAt || 0).getTime();
      const db = new Date(b.createdAt || 0).getTime();
      return db - da;
    });
  }, [records]);

  // ✅ aplica filtros no FRONT
  const filtered = useMemo(() => {
    const teamQ = (filters?.team || "").trim().toLowerCase();
    const matchQ = (filters?.match || "").trim();

    return sorted.filter((r) => {
      const teamNum = String(r.teamNumber ?? "");
      const teamName = (
        r.teamName ||
        getTeamName(r.teamNumber) ||
        ""
      ).toLowerCase();
      const teamText = `${teamName} #${teamNum}`.toLowerCase();

      const matchText = String(r.matchNumber ?? "");

      const teamDigits = teamQ.replace(/\D/g, "");
      const okTeam =
        !teamQ ||
        teamText.includes(teamQ) ||
        (teamDigits && teamNum.includes(teamDigits)) ||
        teamName.includes(teamQ);

      const okMatch = !matchQ || matchText.includes(matchQ);

      return okTeam && okMatch;
    });
  }, [sorted, filters, records]); // records pra pegar TEAMS lookup refletido

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

  const formatTeamFull = (teamNumber) => {
    const num = Number(teamNumber);
    const name = getTeamName(num);
    if (!num) return "-";
    return name ? `${name} #${num}` : `#${num}`;
  };

  const removeRecord = async (id) => {
    const ok = window.confirm("Tem certeza que deseja excluir este scout?");
    if (!ok) return;

    try {
      await deleteScoutMatch(id);

      setRecords((prev) => prev.filter((r) => r.id !== id));
      if (selected?.id === id) setSelected(null);

      toast.success("Scout excluído do banco!");
    } catch (err) {
      console.log("delete error:", err?.response?.status, err?.response?.data);
      toast.error("Erro ao excluir scout.");
    }
  };

  const gridCols =
    "grid-cols-[100fr_220fr_100fr_100fr_100fr_100fr_120fr_120fr]";
  const cell = "flex items-center justify-center";

  // dados do time do selecionado (pro modal)
  const selectedTeamNumber = selected ? Number(selected.teamNumber) : null;
  const selectedTeamName = selectedTeamNumber
    ? getTeamName(selectedTeamNumber)
    : null;

  return (
    <>
      <div
        className="
        w-full
        max-w-130 sm:max-w-180 md:max-w-245 lg:max-w-300
        bg-background flex flex-col text-text
        p-4 sm:p-5 md:p-6
        mt-4 sm:mt-5 mb-4 sm:mb-5
        rounded-2xl sm:rounded-[18px] md:rounded-[20px]
        border-2 border-border
      "
      >
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex gap-2">
            <ChartLine />
            <h1 className="text-xl sm:text-2xl font-bold">
              Registros{" "}
              {loading
                ? "(Carregando...)"
                : `(${filtered.length}/${sorted.length})`}
            </h1>
          </div>

          <button
            type="button"
            onClick={load}
            className="rounded-lg px-4 py-2 border-2 border-border hover:bg-lightblue transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            title="Recarregar"
            disabled={loading}
          >
            Atualizar
          </button>
        </div>

        {/* Header */}
        {/* Mobile: Partida | Time | Posição | Ciclos*/}
        {/* Tablet (md): Partida | Time | Posição | Ciclos | Endgame | Scout | Ações*/}
        {/* PC (lg): Partida | Time | Posição | Ciclos | Quebrou | Endgame | Scout | Ações */}
        <div
          className="
          w-full font-semibold text-text pb-2 border-b border-[#2e2e2e]
          grid gap-2
          grid-cols-4
          md:grid-cols-7
          lg:grid-cols-8
        "
        >
          <p className={cell}>Partida</p>
          <p className={cell}>Time</p>
          <p className={cell}>Posição</p>
          <p className={cell}>Ciclos</p>

          {/* Tablet+ */}
          <p className={`${cell} hidden md:flex`}>Endgame</p>
          <p className={`${cell} hidden md:flex`}>Scout</p>

          {/* PC only */}
          <p className={`${cell} hidden lg:flex`}>Quebrou</p>

          {/* Tablet+ */}
          <p className={`${cell} hidden md:flex`}>Ações</p>
        </div>

        {/* Body */}
        <div className="w-full flex flex-col">
          {filtered.length === 0 && !loading ? (
            <div className="py-6 text-center text-text">
              Nenhum registro encontrado.
            </div>
          ) : (
            filtered.map((r) => (
              <div key={r.id} className="w-full border-b border-border py-3">
                {/* Linha principal (grid) */}
                <div
                  className="
                  grid gap-2 items-center
                  grid-cols-4
                  md:grid-cols-7
                  lg:grid-cols-8
                "
                >
                  <p className={cell}>{r.matchNumber ?? "-"}</p>

                  <p className={`${cell} px-2 text-center leading-tight`}>
                    {formatTeamFull(r.teamNumber)}
                  </p>

                  <p className={cell}>{formatPos(r.startPos)}</p>

                  <p className={cell}>
                    {(Number(r.autoCycles) || 0) +
                      (Number(r.teleopCycles) || 0)}
                  </p>

                  {/* Tablet+ */}
                  <p className={`${cell} hidden md:flex`}>
                    {formatLvl(r.endgame)}
                  </p>

                  <p className={`${cell} hidden md:flex`}>
                    {r.user?.username ?? "-"}
                  </p>

                  {/* PC only */}
                  <p className={`${cell} hidden lg:flex`}>
                    {r.robotBroke ? "Sim" : "Não"}
                  </p>

                  {/* Tablet+ ações (continua flex-col) */}
                  <div className={`${cell} hidden md:flex gap-2 flex-col`}>
                    <button
                      type="button"
                      onClick={() => setSelected(r)}
                      className="flex items-center rounded-lg gap-2 px-3 py-2 border-2 border-border hover:bg-lightblue transition-all duration-200 cursor-pointer"
                    >
                      <Maximize2 />
                      Exibir
                    </button>

                    <button
                      type="button"
                      onClick={() => removeRecord(r.id)}
                      className="items-center flex gap-2 rounded-lg px-3 py-2 border-2 border-border hover:bg-lightblue transition-all duration-200 cursor-pointer"
                      title="Excluir"
                    >
                      <Trash />
                      Excluir
                    </button>
                  </div>
                </div>

                {/* Mobile ações embaixo, centralizado */}
                <div className="mt-3 flex md:hidden justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelected(r)}
                    className="items-center flex gap-2 rounded-lg px-3 py-2 border-2 border-border hover:bg-lightblue transition-all duration-200 cursor-pointer"
                  >
                    <Maximize2 />
                    Exibir
                  </button>

                  <button
                    type="button"
                    onClick={() => removeRecord(r.id)}
                    className="items-center flex gap-2 rounded-lg px-3 py-2 border-2 border-border hover:bg-lightblue transition-all duration-200 cursor-pointer"
                    title="Excluir"
                  >
                    <Trash />
                    Excluir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="
      fixed inset-0 bg-black/30 z-50
      flex items-start sm:items-center justify-center
      overflow-y-auto
      p-3 sm:p-6
    "
          onClick={() => setSelected(null)}
        >
          <div
            className="
        w-full
        max-w-140 md:max-w-205 lg:max-w-245
        bg-background rounded-2xl md:rounded-[20px]
        border-2 border-border
        p-4 sm:p-5 md:p-6
        max-h-[90vh]
        overflow-y-auto
      "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl sm:text-2xl font-bold text-text">
                  {selectedTeamName
                    ? `${selectedTeamName} #${selectedTeamNumber}`
                    : `Equipe #${selectedTeamNumber || "-"}`}
                </h2>

                <div className="flex flex-col sm:flex-row sm:gap-6 gap-1 text-text">
                  <p>
                    <span className="font-semibold text-text">Partida:</span>{" "}
                    {selected.matchNumber ?? "-"}
                  </p>
                  <p>
                    <span className="font-semibold text-text">Scout:</span>{" "}
                    {selected.user?.username ?? "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 text-text">
              <div>
                <p className="font-semibold text-text">Posição Inicial</p>
                <p>{formatPos(selected.startPos)}</p>
              </div>

              <div>
                <p className="font-semibold text-text">Ciclos no Autonomo</p>
                <p>{selected.autoCycles ?? 0}</p>
              </div>

              <div>
                <p className="font-semibold text-text">Ciclos no Teleoperado</p>
                <p>{selected.teleopCycles ?? 0}</p>
              </div>

              <div>
                <p className="font-semibold text-text">Quebrou</p>
                <p>{selected.robotBroke ? "Sim" : "Não"}</p>
              </div>

              <div>
                <p className="font-semibold text-text">Auto Funcionou</p>
                <p>{selected.autoWorked ? "Sim" : "Não"}</p>
              </div>

              <div>
                <p className="font-semibold text-text">Escalada no Endgame</p>
                <p>{formatLvl(selected.endgame)}</p>
              </div>

              <div>
                <p className="font-semibold text-text">Escalado no Auto</p>
                <p>{formatLvl(selected.autoClimb)}</p>
              </div>

              <div className="sm:col-span-2">
                <p className="font-semibold text-text">Observações</p>
                <p className="wrap-break-word">{selected.notes || "-"}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={() => removeRecord(selected.id)}
                className="text-text rounded-lg px-4 py-2 border-2 border-border hover:bg-lightblue transition-all duration-200 cursor-pointer"
              >
                Excluir
              </button>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg px-6 py-2 bg-darkblue text-white hover:bg-hoverblue transition-all duration-200 cursor-pointer"
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
