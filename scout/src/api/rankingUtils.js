// src/utils/rankingUtils.js

export function calcConsistency(teamMatches, tolPct = 0.2) {
  if (!teamMatches?.length) return 0;

  const cycles = teamMatches.map(
    (m) => Number(m.autoCycles ?? 0) + Number(m.teleopCycles ?? 0),
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

  // robotBroke pode ser boolean ou 0/1
  const brokeCount = teamMatches.filter((m) => {
    const b = m.robotBroke ?? m.areBroke ?? m.broke ?? false;
    return Number(b) === 1 || b === true;
  }).length;

  const x = brokeCount / n;

  const inconsistent = excessAvg > 0;
  const penaltyMult = inconsistent ? 1.5 : 1.0;
  const penaltyPoints = Math.round(base * x * penaltyMult);

  return Math.max(0, base - penaltyPoints);
}

/**
 * Normaliza o scout para o formato usado pelo ranking (teamNumber, autoCycles, teleopCycles, robotBroke)
 */
export function normalizeScoutForRanking(raw) {
  const teamNumber =
    raw.teamNumber ??
    raw.team_number ??
    raw.team?.number ??
    raw.team?.teamNumber ??
    raw.team ??
    raw.teamId ??
    null;

  const teamName =
    raw.teamName ?? raw.team_name ?? raw.team?.name ?? raw.team?.teamName ?? "";

  const autoCycles = Number(raw.autoCycles ?? raw.auto_cycles ?? raw.auto ?? 0);

  // ⚠️ no seu backend é tele_cycles -> teleCycles
  const teleopCycles = Number(
    raw.teleCycles ?? raw.teleopCycles ?? raw.teleop_cycles ?? raw.teleop ?? 0,
  );

  // broke pode vir como areBroke boolean no seu ScoutMatch
  const brokeBool = raw.areBroke ?? raw.robotBroke ?? raw.broke ?? false;
  const robotBroke = brokeBool ? 1 : 0;

  return {
    ...raw,
    teamNumber,
    teamName,
    autoCycles,
    teleopCycles,
    robotBroke,
  };
}

/**
 * Recebe todos os scouts (já normalizados ou não) e devolve:
 * [{ teamNumber, teamName, consistency, matchesCount }, ...] ordenado.
 */
export function buildRankingFromScouts(recordsRaw) {
  const records = (Array.isArray(recordsRaw) ? recordsRaw : [])
    .map(normalizeScoutForRanking)
    .filter((r) => r.teamNumber != null && String(r.teamNumber).trim() !== "");

  const byTeam = new Map();

  for (const r of records) {
    const key = String(r.teamNumber);
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
}

/**
 * Retorna a posição (1-based). Se não existir, retorna null.
 */
export function getTeamRank(ranking, teamNumber) {
  const idx = (ranking ?? []).findIndex(
    (t) => Number(t.teamNumber) === Number(teamNumber),
  );
  return idx >= 0 ? idx + 1 : null;
}
