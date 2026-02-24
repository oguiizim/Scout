import client from "../client.js";

export async function fetchMyTeamScouts(teamNumber) {
  const { data } = await client.get(`/scoutmatch/me/team/${teamNumber}`);
  return Array.isArray(data) ? data : [];
}

export async function fetchMyTeamPitScout(teamNumber) {
  const { data } = await client.get(`/scoutpit/team/${teamNumber}`);
  return data ?? null; // <-- objeto ScoutPit
}

export async function fetchMyTeamPitScout2(teamNumber) {
  const { data } = await client.get(`/scoutpit/team/${teamNumber}`);

  // ✅ Se vier array, ok.
  if (Array.isArray(data)) return data;

  // ✅ Se vier um objeto único (pit scout), transforma em array com 1 item
  if (data && typeof data === "object") return [data];

  // ✅ Se vier null/undefined
  return [];
}

export async function fetchHasPitScout(teamNumber) {
  const res = await client.get(`/scoutpit/team/${teamNumber}`, {
    // ✅ não jogar no catch quando for 404 (que pra gente significa "não tem")
    validateStatus: (s) => (s >= 200 && s < 300) || s === 404,
  });

  // 404 = não existe pit scout pra esse time
  if (res.status === 404) return false;

  const data = res.data;

  // 204/empty
  if (data == null) return false;
  if (typeof data === "string" && data.trim() === "") return false;

  // se vier array
  if (Array.isArray(data)) return data.length > 0;

  // se vier objeto
  if (typeof data === "object") return Object.keys(data).length > 0;

  // fallback
  return Boolean(data);
}
