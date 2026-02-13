import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext.jsx";

import "./index.css";

import Login from "./pages/login/Login.jsx";
import Register from "./pages/register/Register.jsx";
import ScoutM from "./pages/scout/ScoutM.jsx";
import ScoutP from "./pages/scout/ScoutP.jsx";
import Records from "./pages/records/Records";
import Ranking from "./pages/ranking/Ranking.jsx";
import TeamInfo from "./pages/ranking/TeamInfo.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import PitScout from "./pages/scout/ScoutInfo.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="bottom-left"
          toastOptions={{ style: { zIndex: 9999999 } }}
        />
        <Routes>
          {/* Rota inicial */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Atalho Scout */}
          <Route path="/scout" element={<Navigate to="/scout/m" replace />} />

          {/* Scouting */}
          <Route path="/scout/m" element={<ScoutM />} />
          <Route path="/scout/p" element={<ScoutP />} />

          {/* Registros */}
          <Route path="/records" element={<Records />} />

          {/* Dashboard (placeholder) */}
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/teamInfo" element={<TeamInfo />}></Route>

          <Route path="/dashboard/:teamNumber" element={<Dashboard />} />
          <Route path="/info/:teamNumber" element={<PitScout />}></Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
