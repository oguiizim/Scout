import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import useWorkspace from "../../context/UseWorkspace.jsx";
import toast from "react-hot-toast";
import back from "../../assets/icons8-voltar.png";
import maintence from "../../assets/manu.gif";
import { joinWorkspaceByCode } from "../../api/services/workspace.js";

function Settings() {
  const navigate = useNavigate();

  return (
    <div className="font-nunito w-full min-h-screen text-black flex items-center justify-center bg-[#ffffff]">
        <div className="flex items-center gap-5">
            <h1 className="font-bold text-4xl">Pagina em andamento!!</h1>
            <img src={maintence} alt="" />
        </div>
    </div>
  );
}

export default Settings;
