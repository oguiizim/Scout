import client from "../client.js";

export async function getUser(id) {
  const res = await client.get(`/user/{id}`);
  return res.data;
}

export async function getMe() {
  const res = await client.get("/user/me");
  return res.data;
}
