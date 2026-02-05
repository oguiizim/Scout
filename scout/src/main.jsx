import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Login from "./pages/login/Login.jsx";
import ScoutM from "./pages/scout/ScoutM.jsx";
import ScoutP from "./pages/scout/ScoutP.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <Login /> */}
    <ScoutM />
    {/* <ScoutP /> */}
  </StrictMode>,
);
