import { createContext, useEffect, useState } from "react";
import api from "../api/client.js";

// eslint-disable-next-line react-refresh/only-export-components
export const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ children }) {
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [loadingWorkspace, setLoadingWorkspace] = useState(true);

  async function refreshActiveWorkspace() {
    const { data } = await api.get("/workspaces/active");
    setActiveWorkspace(data);
  }

  async function setActive(workspaceId) {
    await api.put("/workspaces/active", { workspaceId });
    await refreshActiveWorkspace();
  }

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/workspaces/active");
        setActiveWorkspace(data);
      } catch (e) {
        console.error("Erro ao carregar workspace:", e);
        setActiveWorkspace(null); // ✅ não quebra
      } finally {
        setLoadingWorkspace(false);
      }
    })();
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        activeWorkspace,
        loadingWorkspace,
        refreshActiveWorkspace,
        setActive,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}
