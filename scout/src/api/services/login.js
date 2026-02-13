import client from "../client.js";

export async function loginUser(userData) {
  return client.post("/login", userData);
  
}
