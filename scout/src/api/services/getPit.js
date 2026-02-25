// src/api/services/getMatchesUser.js
import client from "../client.js";

export async function getPit(team) {
  const res = await client.get(`/scoutpit/team/${team}`);
  return res.data;
}

export async function submitPitData(pitData) {
  const { data } = await client.post("/scoutpit", pitData);
  return data;
}

export async function updatePit(team, pitData) {
  const { data } = await client.put(`/scoutpit/${team}`, pitData);
  return data;
}

export async function deletePit(team) {
  const res = await client.delete(`/del/scoutpit/${team}`);
  return res.data;
}
