import { fetchMyTeamScouts } from "./dashboard.js";
import { getPit } from "./getPit.js";

function getMatchCycles(m) {
  const auto = Number(m?.autoCycles ?? 0);
  const tele = Number(m?.teleCycles ?? 0);
  return auto + tele;
}

function getPitCapacity(p) {
  return Number(p?.storage ?? 0);
}

const AUTO_TOWER_POINTS = { l1: 15, l2: 25, l3: 35 };
const END_TOWER_POINTS = { l1: 10, l2: 20, l3: 30 };

function normLevel(v) {
  const s = String(v ?? "")
    .toLowerCase()
    .trim();
  return s === "l1" || s === "l2" || s === "l3" ? s : "none";
}

function modeLevel(levels) {
  // levels já deve vir só com l1/l2/l3
  const count = { l1: 0, l2: 0, l3: 0 };
  for (const lv of levels) count[lv]++;

  // desempate: l3 > l2 > l1 (mais “otimista”)
  if (count.l3 >= count.l2 && count.l3 >= count.l1) return "l3";
  if (count.l2 >= count.l1) return "l2";
  return "l1";
}

function calcTowerPoints(matches) {
  const totalMatches = matches.length || 0;
  if (!totalMatches)
    return {
      autoTowerPts: 0,
      autoTowerLevel: "none",
      endTowerPts: 0,
      endTowerLevel: "none",
    };

  // --- AUTO ---
  const autoLevels = matches.map((m) => normLevel(m?.towerAuto));
  const autoValid = autoLevels.filter((lv) => lv !== "none");
  const autoRate = autoValid.length / totalMatches;

  let autoTowerLevel = "none";
  let autoTowerPts = 0;

  if (autoRate > 0.5 && autoValid.length) {
    autoTowerLevel = modeLevel(autoValid);
    autoTowerPts = AUTO_TOWER_POINTS[autoTowerLevel] ?? 0;
  }

  // --- ENDGAME / TELEOP ---
  const endLevels = matches.map((m) => normLevel(m?.towerEnd));
  const endValid = endLevels.filter((lv) => lv !== "none");

  let endTowerLevel = "none";
  let endTowerPts = 0;

  if (endValid.length) {
    endTowerLevel = modeLevel(endValid);
    endTowerPts = END_TOWER_POINTS[endTowerLevel] ?? 0;
  }

  return { autoTowerPts, autoTowerLevel, endTowerPts, endTowerLevel };
}

export async function predictMatch({ redTeams, blueTeams }) {
  const pointsPerBall = 1;
  const allTeams = [...redTeams, ...blueTeams].map(Number);

  const teamData = await Promise.all(
    allTeams.map(async (team) => {
      const matches = await fetchMyTeamScouts(team).catch(() => []);
      const pit = await getPit(team).catch(() => null);

      const safeMatches = Array.isArray(matches) ? matches : [];

      const cycles = safeMatches.map(getMatchCycles).filter(Number.isFinite);
      const avgCycles = cycles.length
        ? cycles.reduce((a, b) => a + b, 0) / cycles.length
        : 0;

      const capacity = pit ? getPitCapacity(pit) : 0;

      const expectedBalls = avgCycles * (capacity * 0.75);
      const ballsPoints = expectedBalls * pointsPerBall;

      // ✅ tower points
      const { autoTowerPts, autoTowerLevel, endTowerPts, endTowerLevel } =
        calcTowerPoints(safeMatches);

      const expectedTowerPoits = autoTowerPts + endTowerPts;
      const expectedPoints = ballsPoints + expectedTowerPoits;

      return {
        teamNumber: team,
        avgCycles,
        capacity,
        expectedBalls,
        ballsPoints,
        autoTowerPts,
        autoTowerLevel,
        endTowerPts,
        endTowerLevel,
        expectedPoints,
        expectedTowerPoits,
      };
    }),
  );

  const map = new Map(teamData.map((t) => [t.teamNumber, t]));

  const sumAlliance = (teams) => {
    const details = teams.map(
      (t) =>
        map.get(Number(t)) ?? {
          teamNumber: t,
          expectedPoints: 0,
          avgCycles: 0,
          capacity: 0,
          expectedBalls: 0,
          ballsPoints: 0,
          autoTowerPts: 0,
          autoTowerLevel: "none",
          endTowerPts: 0,
          endTowerLevel: "none",
        },
    );

    const total = details.reduce(
      (s, d) => s + (Number(d.expectedPoints) || 0),
      0,
    );

    return { total, details };
  };

  const red = sumAlliance(redTeams);
  const blue = sumAlliance(blueTeams);

  return {
    red,
    blue,
    final: { red: Math.round(red.total), blue: Math.round(blue.total) },
  };
}
