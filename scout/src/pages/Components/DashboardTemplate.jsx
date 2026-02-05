import { useParams, useNavigate } from "react-router-dom";

function Dashboard() {
  const { teamNumber } = useParams(); // ← vem da URL
  const navigate = useNavigate();

  return (
    <div className="w-[80vw] bg-white flex flex-col text-black p-6 mt-5 mb-5 rounded-[20px] border-2 border-[#E7E7E9]">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Dashboard #{teamNumber}:</h1>
        <button
          type="button"
          className="w-10 h-10 cursor-pointer"
          onClick={() => {
            navigate(`/ranking`);
            onClose();
          }}
          title="Sair"
          aria-label="Sair"
        >
          <img src="/src/assets/icons8-sair.png" alt="Sair" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-amber-300">Total de Scouts:</div>
        <div className="bg-amber-400">Taxa de Quebras:</div>
        <div className="bg-amber-500">Media de Ciclos:</div>
        <div className="bg-amber-600">Distribuição da Tower:</div>
        <div className="col-span-2 bg-amber-700">
          Grafico dos ciclos em Partida:
        </div>
        <div className="col-span-2 bg-amber-800">Melhores Pontuações:</div>
      </div>
    </div>
  );
}
export default Dashboard;
