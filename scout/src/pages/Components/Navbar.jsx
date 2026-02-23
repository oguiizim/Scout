import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useEffect, useState } from "react";
import prancheta from "../../assets/prancheta.png";
import papel from "../../assets/document.png";
import ranking from "../../assets/ranking.png";
import grafico from "../../assets/graph.png";
import grafico_gif from "../../assets/graph-gif.gif";
import sair from "../../assets/sair.png";
import sair_gif from "../../assets/sair-gif.gif";
import axion from "../../assets/logo.svg";
import settings from "../../assets/configuracoes.png";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);

  const [isHover, setIsHover] = useState(false);

  // fecha menu ao trocar de tamanho pra tablet/pc
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false); // md
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const baseLink =
    "flex items-center rounded-md transition-all duration-200 select-none";
  const inactive = "hover:bg-[#F1F5F9]";
  const active = "bg-[#F1F5F9] font-semibold";

  // tamanhos por nível:
  // - mobile: não usa NavLinks em linha
  // - tablet (md): compacto
  // - pc (lg+): confortável
  const linkClass = ({ isActive }) =>
    [
      baseLink,
      // compact em tablet, maior no pc
      "gap-2 px-3 py-2 md:gap-2 md:px-2.5 md:py-2 lg:px-4",
      "hover:scale-[1.02]",
      isActive ? active : inactive,
    ].join(" ");

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const go = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <nav className="font-nunito w-full border-b-2 border-[#E7E7E9] bg-white text-black">
      <div
        className="
          flex items-center justify-between
          px-3 sm:px-4 md:px-6 lg:px-10 xl:px-24 2xl:px-40
          py-3
        "
      >
        {/* Brand */}
        <button
          type="button"
          onClick={() => go("/home")}
          className="flex items-center gap-3 font-bold cursor-pointer"
        >
          <div className="h-10 w-10 md:h-11 md:w-11 lg:h-12 lg:w-12 shrink-0">
            <img
              src={axion}
              alt="Logo"
              className="h-full w-full object-contain"
            />
          </div>

          {/* 3 níveis de título */}
          <span className="text-base sm:text-lg lg:text-xl">
            <span className="inline md:hidden">Scout</span>
            <span className="hidden md:inline lg:hidden">FRC Scout</span>
            <span className="hidden lg:inline">FRC Scout 2026</span>
          </span>
        </button>

        {/* Links em linha só a partir do tablet (md) */}
        <ul className="hidden md:flex items-center md:gap-2 lg:gap-3">
          <li>
            <NavLink to="/scout/m" className={linkClass}>
              <img src={prancheta} className="w-5 h-5" alt="" />
              {/* tablet: texto curto | pc: texto completo */}
              <span className="text-sm lg:text-base">
                <span className="inline lg:hidden">Partidas</span>
                <span className="hidden lg:inline">Scouting de Partidas</span>
              </span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/scout/p" className={linkClass}>
              <img src={papel} className="w-5 h-5" alt="" />
              <span className="text-sm lg:text-base">
                <span className="inline lg:hidden">Pit</span>
                <span className="hidden lg:inline">Scouting de Pit</span>
              </span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/records"
              className={linkClass}
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
            >
              <img
                src={isHover ? grafico_gif : grafico}
                className="w-5 h-5"
                alt=""
              />
              <span className="text-sm lg:text-base">Registros</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/ranking"
              className={linkClass}
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
            >
              <img src={ranking} className="w-5 h-5" alt="" />
              <span className="text-sm lg:text-base">Ranking</span>
            </NavLink>
          </li>
        </ul>

        {/* Right side: user SEMPRE na navbar + logout + hamburger no mobile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* user sempre visível */}
          <span
            className="
              text-xs sm:text-sm md:text-sm text-[#b6b6b6]
              max-w-22.5 sm:max-w-35 md:max-w-40 lg:max-w-55
              truncate
            "
            title={user || ""}
          >
            {user}
          </span>

          <div className="w-10 h-10 grid place-items-center rounded-md hover:bg-[#F1F5F9] transition">
            <NavLink
              to="/settings"
              className="w-7 h-7 hover:rotate-90 hover:scale-105 transition-all duration-500"
            >
              <img src={settings} alt="Config" />
            </NavLink>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            className="w-10 h-10 grid place-items-center rounded-md hover:bg-[#F1F5F9] transition"
            title="Sair"
            aria-label="Sair"
          >
            <img
              src={isHover ? sair_gif : sair}
              alt="Sair"
              className="w-6 h-6"
            />
          </button>

          {/* Hamburger só no celular */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden w-10 h-10 grid place-items-center rounded-md hover:bg-[#F1F5F9] transition"
            aria-label="Abrir menu"
            title="Menu"
          >
            <div className="flex flex-col gap-1">
              <span className="block w-5 h-0.5 bg-black" />
              <span className="block w-5 h-0.5 bg-black" />
              <span className="block w-5 h-0.5 bg-black" />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu (somente celular). User NÃO aparece aqui */}
      {open && (
        <div className="md:hidden border-t border-[#E7E7E9] px-3 sm:px-4 pb-4">
          <div className="pt-3 flex flex-col gap-2">
            <button
              className="flex items-center gap-2 rounded-md px-4 py-3 hover:bg-[#F1F5F9] transition"
              onClick={() => go("/scout/m")}
              type="button"
            >
              <img src={prancheta} className="w-5 h-5" alt="" />
              Scouting de Partidas
            </button>

            <button
              className="flex items-center gap-2 rounded-md px-4 py-3 hover:bg-[#F1F5F9] transition"
              onClick={() => go("/scout/p")}
              type="button"
            >
              <img src={papel} className="w-5 h-5" alt="" />
              Scouting de Pit
            </button>

            <button
              className="flex items-center gap-2 rounded-md px-4 py-3 hover:bg-[#F1F5F9] transition"
              onClick={() => go("/records")}
              type="button"
            >
              <img src={grafico} className="w-5 h-5" alt="" />
              Registros
            </button>

            <button
              className="flex items-center gap-2 rounded-md px-4 py-3 hover:bg-[#F1F5F9] transition"
              onClick={() => go("/ranking")}
              type="button"
            >
              <img src={ranking} className="w-5 h-5" alt="" />
              Ranking
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
