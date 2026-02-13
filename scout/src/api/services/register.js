import client from "../client.js";

export async function registerUser(userData) {
  const { data } = await client.post("/user", userData);
  return data;
}
