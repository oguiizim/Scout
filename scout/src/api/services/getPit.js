// src/api/services/getMatchesUser.js
import client from "../client.js";

export async function getPit(team) {
  const res = await client.get(`/scoutpit/team/${team}`);
  return res.data;
}
