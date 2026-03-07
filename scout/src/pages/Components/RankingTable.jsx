import { useEffect, useMemo, useState } from "react";
import { fetchAllScoutsForRanking } from "../../api/services/rankingServices.js";
import { ChartNoAxesColumn } from "lucide-react";
import TeamInfo from "../ranking/TeamInfo";
import useWorkspace from "../../context/UseWorkspace.jsx";

function calcConsistency(teamMatches) {
  if (!teamMatches?.length) return 0;

  const cycles = teamMatches.map((m) => Math.max(0, m.teleCycles ?? 0));
  const n = cycles.length;

  if (n === 0) return 0;

  const sorted = [...cycles].sort((a, b) => a - b);
  const median =
    n % 2 === 0
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
      : sorted[Math.floor(n / 2)];

  if (median <= 0) return 0;

  // Só considera ruim se fizer 60% ou menos da mediana
  const threshold = median * 0.6;

  // Conta quantas partidas ficaram abaixo ou igual ao limite
  const lowMatches = cycles.filter((v) => v <= threshold).length;
  const lowRate = lowMatches / n;

  // Penalidade leve por partidas muito abaixo do padrão
  const base = Math.round(100 * (1 - lowRate));

  // Penalidade separada por quebra real
  const brokeCount = teamMatches.filter((m) => m.areBroke === true).length;
  const brokeRate = brokeCount / n;

  // Quebra pesa, mas não destrói completamente a nota
  const breakPenalty = Math.round(brokeRate * 25);

  return Math.max(0, base - breakPenalty);
}

/**
 * ✅ Ajuste aqui para bater com o retorno REAL do seu backend.
 * Como você tem ScoutMatch no Spring, muito provável que venha:
 * raw.team.number (e raw.team.name) OU raw.teamNumber direto.
 */
function normalizeScout(raw) {
  // tenta achar teamNumber de várias formas
  const teamNumber = raw.team ?? null;

  const teamName =
    raw.teamName ?? raw.team_name ?? raw.team?.name ?? raw.team?.teamName ?? "";

  const autoCycles = raw.autoCycles ?? 0;
  const teleCycles = raw.teleCycles ?? 0;

  const areBroke = raw.areBroke ?? false;

  return {
    ...raw,
    teamNumber,
    teamName,
    autoCycles,
    teleCycles,
    areBroke,
  };
}

export default function RankingTable() {
  const { activeWorkspace } = useWorkspace();
  const [records, setRecords] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [popupPos, setPopupPos] = useState(null);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setErrorMsg("");

      try {
        const scouts = await fetchAllScoutsForRanking();

        // ✅ AQUI estava o problema: você estava setando cru e o teamNumber vinha undefined
        const normalized = (Array.isArray(scouts) ? scouts : [])
          .map(normalizeScout)
          .filter(
            (r) => r.teamNumber != null && String(r.teamNumber).trim() !== "",
          );

        setRecords(normalized);

        // debug útil
        console.log("[ranking] total scouts:", scouts?.length ?? 0);
        console.log("[ranking] normalized:", normalized);
      } catch (err) {
        console.error("Erro:", err);

        const status = err?.response?.status;
        const apiMsg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          (typeof err?.response?.data === "string" ? err.response.data : "");

        setErrorMsg(
          `Erro ao carregar scouts` +
            (status ? ` (HTTP ${status})` : "") +
            (apiMsg ? `: ${apiMsg}` : ""),
        );
        setRecords([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [activeWorkspace?.id]);

  const ranking = useMemo(() => {
    const byTeam = new Map();

    for (const r of records) {
      const key = String(r.teamNumber); // agora nunca é undefined
      if (!byTeam.has(key)) {
        byTeam.set(key, {
          teamNumber: r.teamNumber,
          teamName: r.teamName || "",
          matches: [],
        });
      }
      byTeam.get(key).matches.push(r);
    }

    const arr = Array.from(byTeam.values()).map((t) => {
      const consistency = calcConsistency(t.matches);

      const cycles = t.matches.map((m) => Math.max(0, m.teleCycles ?? 0));
      const avgCycles =
        cycles.length > 0
          ? cycles.reduce((sum, v) => sum + v, 0) / cycles.length
          : 0;

      const totalArmazem = t.matches.reduce(
        (sum, m) => sum + (Number(m.storage) || 0),
        0,
      );

      return {
        teamNumber: t.teamNumber,
        teamName: t.teamName,
        consistency,
        avgCycles,
        totalArmazem,
        matchesCount: t.matches.length,
      };
    });

    arr.sort((a, b) => {
      // 1. Consistência
      if (b.consistency !== a.consistency) {
        return b.consistency - a.consistency;
      }
      // 2. Média de ciclos
      if (b.avgCycles !== a.avgCycles) {
        return b.avgCycles - a.avgCycles;
      }
      // 3. Quantidade de armazém
      if (b.totalArmazem !== a.totalArmazem) {
        return b.totalArmazem - a.totalArmazem;
      }
      // 4. Quantidade de partidas
      if (b.matchesCount !== a.matchesCount) {
        return b.matchesCount - a.matchesCount;
      }
      // 5. Número do time
      return Number(a.teamNumber) - Number(b.teamNumber);
    });

    return arr;
  }, [records]);

  const cell = "flex items-center justify-center";
  const cellTeam = "flex items-center justify-center cursor-pointer";

  return (
    <>
      <div
        className="
        w-full
        max-w-[520px] sm:max-w-[640px] md:max-w-[760px] lg:max-w-[900px]
        bg-background flex flex-col text-text
        p-4 sm:p-5 md:p-6
        mt-4 sm:mt-5 mb-4 sm:mb-5
        rounded-[16px] sm:rounded-[18px] md:rounded-[20px]
        border-2 border-border
      "
      >
        <div className="flex flex-row gap-2 items-center mb-4">
          <ChartNoAxesColumn />
          {/* <img src={rank} alt="Fanking" className="w-8" /> */}
          <h1 className="text-xl sm:text-2xl font-bold">Rankings</h1>
        </div>

        {/* Header */}
        {/* Mobile: Colocação | Time | Consistência (esconde Partidas) */}
        {/* Tablet/PC: mostra tudo */}
        <div
          className="
          w-full grid
          grid-cols-3 md:grid-cols-4
          pb-2 border-b border-[#2e2e2e]
          font-semibold
        "
        >
          <p className={cell}>Colocação</p>
          <p className={cell}>Time</p>
          <p className={cell}>Consistência</p>
          <p className={`${cell} hidden md:flex`}>Partidas</p>
        </div>

        <div className="w-full flex flex-col">
          {loading ? (
            <div className="py-6 text-[#2e2e2e]">Carregando ranking...</div>
          ) : errorMsg ? (
            <div className="py-6 text-[#b00020]">{errorMsg}</div>
          ) : ranking.length === 0 ? (
            <div className="py-6 text-[#2e2e2e]">
              Ainda não há scouts salvos no banco.
            </div>
          ) : (
            ranking.map((t, idx) => (
              <div
                key={String(t.teamNumber)}
                className="
                w-full grid
                grid-cols-3 md:grid-cols-4
                py-3 border-b border-border
                hover:bg-lightblue transition-all duration-200
              "
              >
                <p className={cell}>{idx + 1}º</p>

                <button
                  type="button"
                  className={`${cellTeam} hover:underline underline-offset-4`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const rect = e.currentTarget.getBoundingClientRect();

                    setSelectedTeam({ ...t, rank: idx + 1 });
                    setPopupPos({
                      top: rect.top + window.scrollY,
                      left: rect.right + 12,
                    });
                  }}
                >
                  {t.teamName
                    ? `${t.teamName} #${t.teamNumber}`
                    : `#${t.teamNumber}`}
                </button>

                <p className={cell}>{t.consistency}%</p>

                {/* Partidas só no tablet/pc */}
                <p className={`${cell} hidden md:flex`}>{t.matchesCount}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedTeam && (
        <TeamInfo
          team={selectedTeam}
          position={popupPos}
          onClose={() => {
            setSelectedTeam(null);
            setPopupPos(null);
          }}
        />
      )}
    </>
  );
}
