import client from "../client.js";

export async function submitMatchData(matchData) {
  const { data } = await client.post("/scoutmatch", matchData);
  return data;
}
