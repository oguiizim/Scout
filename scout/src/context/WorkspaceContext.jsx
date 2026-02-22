import { createContext, useEffect, useState } from "react";
import api from "../api/client.js";

const WorkspaceContext = createContext(null);

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
    const loadWorkspace = async () => {
      try {
        await refreshActiveWorkspace();
      } catch (error) {
        console.error("Erro ao carregar workspace:", error);
      } finally {
        setLoadingWorkspace(false);
      }
    };

    loadWorkspace();
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
