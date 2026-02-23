import client from "../client.js";

export async function joinWorkspaceByCode(shareCode, setActive = true) {
  const { data } = await client.post("/workspaces/join", {
    shareCode,
    setActive,
  });
  return data;
}

// extras (opcionais)
export async function getActiveWorkspace() {
  const { data } = await client.get("/workspaces/active");
  return data;
}

export async function setActiveWorkspace(workspaceId) {
  await client.put("/workspaces/active", { workspaceId });
}

export async function listMyWorkspaces() {
  const { data } = await client.get("/workspaces/me");
  return data;
}
