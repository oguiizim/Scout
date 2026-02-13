import client from "../client.js";

export async function loginUser(userData) {
  const { data } = await client.post("/login", userData);
  return data;
}
