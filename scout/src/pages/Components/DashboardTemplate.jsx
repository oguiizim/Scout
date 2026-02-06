import { useParams, useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LinearScale, BarElement);

const STORAGE_KEY = "scout_records";

const arrCiclos = [
  { round: 1, ciclos: 10 },
  { round: 2, ciclos: 11 },
  { round: 3, ciclos: 12 },
];

const data = {
  datasets: {
    label: "Rounds",
  },
};

function Dashboard() {
  // const labels = () => [{ num: 12 }, { num: 11 }];
  // const datas = () => [{ num: 120 }, { num: 110 }];
  // const data = {
  //   labels,
  //   datasets: [
  //     {
  //       label: "Missões",
  //       data: datas,
  //       backgroundColor: "#34d399", // emerald-400
  //       borderRadius: 8,
  //     },
  //   ],
  // };

  // const options = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     legend: { display: false },
  //   },
  // };

  const { teamNumber } = useParams(); // ← vem da URL
  const navigate = useNavigate();
  const ctx = document.getElementById("myChart");

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

      <div className="grid grid-cols-4 gap-4 ">
        <div className="p-4 border-2 border-[#E7E7E9] rounded-lg text-xl">
          <p className="font-semibold mb-2">Total de Scouts:</p>
          <p className="font-normal">12</p>
        </div>
        <div className="p-4 border-2 border-[#E7E7E9] rounded-lg text-xl">
          <p className="font-semibold mb-2">Taxa de Quebras:</p>
          <p className="font-normal">1/8</p>
        </div>
        <div className="p-4 border-2 border-[#E7E7E9] rounded-lg text-xl">
          <p className="font-semibold mb-2">Media de Ciclos:</p>
          <p className="font-normal">9</p>
        </div>
        <div className="p-4 border-2 border-[#E7E7E9] rounded-lg text-xl">
          <p className="font-semibold mb-2">Distribuição da Tower:</p>
          <p className="font-normal">12</p>
        </div>
        <div className="col-span-2 p-4 border-2 border-[#E7E7E9] rounded-lg text-xl">
          <p className="font-semibold mb-2">Grafico dos ciclos em Partida:</p>
          {/* <Bar data={data} options={options}></Bar> */}
        </div>
        <div className="col-span-2 p-4 border-2 border-[#E7E7E9] rounded-lg text-xl">
          <p className="font-semibold mb-2">Melhores Pontuações:</p>
          <p className="font-normal">12</p>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
