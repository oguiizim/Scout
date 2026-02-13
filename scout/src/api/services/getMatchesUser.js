// src/api/services/getMatchesUser.js
import client from "../client.js";

export async function getMyScoutMatches() {
  const res = await client.get("/scoutmatch/me");
  return res.data;
}
