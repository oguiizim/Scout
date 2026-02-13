import client from "../client.js";

export async function submitPitData(pitData) {
  const { data } = await client.post("/scoutpit", pitData);
  return data;
}
