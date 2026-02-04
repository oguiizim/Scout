import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Login from "./pages/login/Login.jsx";
import Scout from "./pages/scout/Scout.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <Login /> */}
    <Scout />
  </StrictMode>,
);
