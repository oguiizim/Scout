import { useContext } from "react";
import { WorkspaceContext } from "./WorkspaceContext.jsx";

export default function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  return ctx ?? { activeWorkspace: null, loadingWorkspace: true };
}
