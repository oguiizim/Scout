import { TEAMS } from "../data/Teams.js";

export function getTeamNameByNumber(teamNumber) {
  return TEAMS.find((t) => Number(t.number) === Number(teamNumber))?.name ?? "";
}
