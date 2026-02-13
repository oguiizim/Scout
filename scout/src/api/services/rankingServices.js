import client from "../client.js";

export async function fetchAllScoutsForRanking() {
  try {
    const res = await client.get("/scoutmatch/me");

    const data = res?.data;

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.data)) return data.data;

    // pra você enxergar o formato que veio
    console.warn("[ranking] Formato inesperado:", data);
    return [];
  } catch (err) {
    // 👇 log completo pra debug
    const status = err?.response?.status;
    const body = err?.response?.data;
    const msg = err?.message;

    console.error("[ranking] Erro ao buscar scouts:", {
      route: "/scoutmatch/me",
      status,
      body,
      msg,
    });

    throw err;
  }
}
