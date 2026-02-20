import { useNavigate } from "react-router-dom";

function TeamInfo({ team, position, onClose }) {
  const navigate = useNavigate();

  if (!team || !position) return null;

  const teamLabel = team.teamName
    ? `${team.teamName} #${team.teamNumber}`
    : `Equipe #${team.teamNumber}`;

  // (opcional) evita sair da tela
  const left = Math.min(position.left, window.innerWidth - 360);
  const top = Math.min(position.top, window.innerHeight - 220);

  return (
    <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose}>
      <div
        className="w-fit bg-white flex flex-col text-black p-6 mt-5 mb-5 rounded-[20px] border-2 border-[#E7E7E9]"
        style={{ position: "fixed", top, left }} // ✅ aqui usa a posição
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row items-center justify-between mb-4 gap-4">
          <h1 className="text-2xl font-bold">Info do Time: {teamLabel}</h1>

          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 border-2 border-[#E7E7E9] rounded-lg cursor-pointer hover:bg-[#F1F5F9] transition-all duration-150"
          >
            Sair
          </button>
        </div>

        <div className="flex flex-row gap-2 font-semibold">
          <button
            type="button"
            onClick={() => {
              navigate(`/info/${team.teamNumber}`);
              onClose();
            }}
            className="w-[50%] p-2 border-2 border-[#E7E7E9] rounded-lg cursor-pointer hover:bg-[#F1F5F9] transition-all duration-150"
          >
            Pit Scouting
          </button>

          <button
            type="button"
            onClick={() => {
              navigate(`/dashboard/${team.teamNumber}`);
              onClose();
            }}
            className="w-[50%] p-3 border-2 border-[#E7E7E9] rounded-lg cursor-pointer hover:bg-[#F1F5F9] transition-all duration-150"
          >
            Dashboard
          </button>

          {/* <NavLink
            type="button"
            to="`/dashboard?team=${team.teamNumber}`"
            className="w-[50%] p-3 border-2 border-[#E7E7E9] rounded-lg cursor-pointer hover:bg-[#F1F5F9] transition-all duration-150"
          >
            Dashboard
          </NavLink> */}
        </div>
      </div>
    </div>
  );
}

export default TeamInfo;
