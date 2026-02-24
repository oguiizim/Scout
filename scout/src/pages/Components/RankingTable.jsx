import { useEffect, useMemo, useState } from "react";
import { fetchAllScoutsForRanking } from "../../api/services/rankingServices.js";
import TeamInfo from "../ranking/TeamInfo";
import useWorkspace from "../../context/UseWorkspace.jsx";
import ranking_gif from "../../assets/ranking-gif.gif";

function calcConsistency(teamMatches, tolPct = 0.2) {
  if (!teamMatches?.length) return 0;

  const cycles = teamMatches.map(
    (m) => (m.autoCycles ?? 0) + (m.teleopCycles ?? 0),
  );
  const n = cycles.length;

  const mean = cycles.reduce((a, b) => a + b, 0) / n;
  if (mean <= 0) return 0;

  const tol = mean * tolPct;

  const excessAvg =
    cycles.reduce((sum, v) => {
      const diff = Math.abs(v - mean);
      return sum + Math.max(0, diff - tol);
    }, 0) / n;

  const base = Math.round((1 / (1 + excessAvg)) * 100);

  const brokeCount = teamMatches.filter((m) => m.robotBroke).length;
  const x = brokeCount / n;

  const inconsistent = excessAvg > 0;
  const penaltyMult = inconsistent ? 1.5 : 1.0;
  const penaltyPoints = Math.round(base * x * penaltyMult);

  return Math.max(0, base - penaltyPoints);
}

/**
 * ✅ Ajuste aqui para bater com o retorno REAL do seu backend.
 * Como você tem ScoutMatch no Spring, muito provável que venha:
 * raw.team.number (e raw.team.name) OU raw.teamNumber direto.
 */
function normalizeScout(raw) {
  // tenta achar teamNumber de várias formas
  const teamNumber =
    raw.teamNumber ??
    raw.team_number ??
    raw.team?.number ?? // ✅ comum no Spring: objeto team
    raw.team?.teamNumber ??
    raw.team ??
    null;

  const teamName =
    raw.teamName ?? raw.team_name ?? raw.team?.name ?? raw.team?.teamName ?? "";

  const autoCycles = raw.autoCycles ?? raw.auto_cycles ?? raw.auto ?? 0;
  const teleopCycles = raw.teleopCycles ?? raw.teleop_cycles ?? raw.teleop ?? 0;

  const robotBroke =
    raw.robotBroke ?? raw.robot_broke ?? raw.broke ?? raw.brokeDown ?? false;

  return {
    ...raw,
    teamNumber,
    teamName,
    autoCycles,
    teleopCycles,
    robotBroke,
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
      return {
        teamNumber: t.teamNumber,
        teamName: t.teamName,
        consistency,
        matchesCount: t.matches.length,
      };
    });

    arr.sort((a, b) => {
      if (b.consistency !== a.consistency) return b.consistency - a.consistency;
      if (b.matchesCount !== a.matchesCount)
        return b.matchesCount - a.matchesCount;
      return Number(a.teamNumber) - Number(b.teamNumber);
    });

    return arr;
  }, [records]);

  const cols = "grid-cols-[0.3fr_0.5fr_0.5fr_0.3fr]";
  const cell = "flex items-center justify-center";
  const cellTeam = "flex items-center justify-center cursor-pointer";

  return (
    <>
      <div
        className="
        w-full
        max-w-[520px] sm:max-w-[640px] md:max-w-[760px] lg:max-w-[900px]
        bg-white flex flex-col text-black
        p-4 sm:p-5 md:p-6
        mt-4 sm:mt-5 mb-4 sm:mb-5
        rounded-[16px] sm:rounded-[18px] md:rounded-[20px]
        border-2 border-[#E7E7E9]
      "
      >
        <div className="flex flex-row gap-2 items-center mb-4">
          <img src={ranking_gif} alt="Fanking" className="w-8" />
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
                py-3 border-b border-[#E7E7E9]
                hover:bg-[#F1F5F9] transition-all duration-200
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
