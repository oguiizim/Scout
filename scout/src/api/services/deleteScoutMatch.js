import client from "../client.js";

export async function deleteScoutMatch(id) {
  const res = await client.delete(`/scoutmatch/${id}`);
  return res.data;
}
