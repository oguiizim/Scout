import client from "../client";

export async function fetchMyTeamScouts(teamNumber) {
  const { data } = await client.get(`/scoutmatch/me/team/${teamNumber}`);
  return Array.isArray(data) ? data : [];
}

export async function fetchMyTeamPitScout(teamNumber) {
  const { data } = await client.get(`/scoutpit/team/${teamNumber}`);
  return data ?? null; // <-- objeto ScoutPit
}
