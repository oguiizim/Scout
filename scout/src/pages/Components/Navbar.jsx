import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

function Navbar() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const links =
    "flex items-center justify-center rounded-md p-2.5 px-4 hover:bg-[#F1F5F9] hover:scale-105 transition-all duration-200 gap-2";
  const inactive = "hover:bg-[#F1F5F9] hover:scale-105";
  const active = "bg-[#F1F5F9] font-semibold";

  const button = ({ isActive }) => `${links} ${isActive ? active : inactive}`;

  const handleLogout = () => {
    // se você estiver usando auth no futuro, limpa aqui
    // localStorage.removeItem("scout_auth");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="font-nunito min-w-screen flex justify-between border-b-2 border-[#E7E7E9] bg-[#ffffff] px-40 text-black">
      {/* Name of the product */}
      <button
        type="button"
        onClick={() => navigate("/scout/m")}
        className="flex justify-start items-center gap-5 text-xl font-bold cursor-pointer"
      >
        <div className="h-15 w-15">
          <img src="/src/assets/Logo Axion.png" alt="Logo" />
        </div>
        FRC Scout 2026
      </button>

      {/* List of links */}
      <ul className="flex justify-center items-center gap-4 m-4">
        <li>
          <NavLink to="/scout/m" className={button}>
            <img src="/src/assets/icons8-prancheta.png" className="w-5 h-5" />
            Scouting de Partidas
          </NavLink>
        </li>

        <li>
          <NavLink to="/scout/p" className={button}>
            <img src="/src/assets/icons8-papel.png" className="w-5 h-5" />
            Scouting de Pit
          </NavLink>
        </li>

        <li>
          <NavLink to="/records" className={button}>
            <img src="/src/assets/icons8-lista.png" className="w-5 h-5" />
            Registros
          </NavLink>
        </li>

        <li>
          <NavLink to="/ranking" className={button}>
            <img src="/src/assets/icons8-grafico.png" className="w-5 h-5" />{" "}
            Ranking
          </NavLink>
        </li>
      </ul>

      {/* Logout */}
      <div className="flex justify-end items-center gap-5 mr-5 text-lr text-[#b6b6b6]">
        {user}
        <button
          type="button"
          onClick={handleLogout}
          className="w-10 h-10 cursor-pointer"
          title="Sair"
          aria-label="Sair"
        >
          <img src="/src/assets/icons8-sair.png" alt="Sair" />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
