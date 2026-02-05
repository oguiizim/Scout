import { useEffect, useMemo, useState } from "react";
import TeamInfo from "../ranking/TeamInfo"; // ajuste o caminho se necessário

const STORAGE_KEY = "scout_records";

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

export default function RankingTable() {
  const [records, setRecords] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [popupPos, setPopupPos] = useState(null);

  useEffect(() => {
    const load = () => {
      try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        setRecords(Array.isArray(data) ? data : []);
      } catch {
        setRecords([]);
      }
    };

    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  const ranking = useMemo(() => {
    const byTeam = new Map();

    for (const r of records) {
      const teamNumber = r.teamNumber;
      if (!teamNumber) continue;

      const key = String(teamNumber);
      if (!byTeam.has(key)) {
        byTeam.set(key, {
          teamNumber,
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
      <div className="w-[40vw] bg-white flex flex-col text-black p-6 mt-5 mb-5 rounded-[20px] border-2 border-[#E7E7E9]">
        <h1 className="text-2xl font-bold mb-4">Rankings</h1>

        {/* Header */}
        <div
          className={`w-full grid ${cols} pb-2 border-b border-[#2e2e2e] font-semibold`}
        >
          <p className={cell}>Colocação</p>
          <p className={cell}>Time</p>
          <p className={cell}>Consistência</p>
          <p className={cell}>Partidas</p>
        </div>

        {/* Body */}
        <div className="w-full flex flex-col">
          {ranking.length === 0 ? (
            <div className="py-6 text-[#2e2e2e]">
              Ainda não há scouts salvos.
            </div>
          ) : (
            ranking.map((t, idx) => (
              <div
                key={String(t.teamNumber)}
                className={`w-full grid ${cols} py-3 border-b border-[#E7E7E9] hover:bg-[#F1F5F9] transition-all duration-200`}
              >
                <p className={cell}>{idx + 1}º</p>

                {/* ✅ SOMENTE o time é botão */}
                <button
                  type="button"
                  className={`${cellTeam} hover:underline underline-offset-4`}
                  onClick={(e) => {
                    e.stopPropagation(); // (opcional) evita qualquer click "vazar"
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
                <p className={cell}>{t.matchesCount}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ✅ Modal TeamInfo */}
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
