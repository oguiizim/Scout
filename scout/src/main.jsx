import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./index.css";

import Login from "./pages/login/Login.jsx";
import ScoutM from "./pages/scout/ScoutM.jsx";
import ScoutP from "./pages/scout/ScoutP.jsx";
import Records from "./pages/records/Records";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rota inicial */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Atalho Scout */}
        <Route path="/scout" element={<Navigate to="/scout/m" replace />} />

        {/* Scouting */}
        <Route path="/scout/m" element={<ScoutM />} />
        <Route path="/scout/p" element={<ScoutP />} />

        {/* Registros */}
        <Route path="/records" element={<Records />} />

        {/* Dashboard (placeholder) */}
        <Route
          path="/dashboard"
          element={
            <div className="p-10 text-2xl font-bold">
              Dashboard (em construção)
            </div>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
