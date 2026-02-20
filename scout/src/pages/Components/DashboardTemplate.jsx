import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import {
  fetchMyTeamScouts,
  fetchMyTeamPitScout,
} from "../../api/services/dashboard.js";
import { getTeamNameByNumber } from "../../api/teamsUtils.js";
import sair from "../../assets/icons8-sair.png";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
);

const PIE_COLORS = [
  "#090B10",
  "#1C2131",
  "#2B324A",
  "#3C4668",
  "#4C5985",
  "#5D6DA2",
  "#7A87B3",
  "#97A2C3",
  "#B5BCD4",
  "#D2D6E5",
  "#EFF0F6",
];

const BAR_COLORS = [
  "#090B10",
  "#1C2131",
  "#2B324A",
  "#3C4668",
  "#4C5985",
  "#5D6DA2",
  "#7A87B3",
  "#97A2C3",
  "#B5BCD4",
  "#D2D6E5",
  "#EFF0F6",
];

function getStorageFromPit(pitData) {
  const pit = Array.isArray(pitData) ? pitData[0] : pitData;
  if (!pit) return 0;

  return Number(
    pit.storage ??
      pit.storageCapacity ??
      pit.capacity ??
      pit.capacidade ??
      pit.qtyStorage ??
      pit.quantidadeArmazenamento ??
      0,
  );
}

// ✅ Ajuste de campos: se seu backend usa outros nomes, mexe só aqui.
function normalizeScout(raw, pitData) {
  const autoCycles = Number(raw.autoCycles ?? raw.auto_cycles ?? 0);

  const teleopCycles = Number(
    raw.teleCycles ?? raw.teleopCycles ?? raw.teleop_cycles ?? 0,
  );

  const totalCycles = autoCycles + teleopCycles;

  // ✅ no seu modelo: areBroke é Boolean (coluna broke)
  const brokeBool = raw.areBroke ?? raw.broke ?? false;
  const robotBroke = brokeBool ? 1 : 0; // padroniza 0/1

  const matchNumber =
    raw.matchNumber ?? raw.match ?? raw.round ?? raw.qual ?? null;

  const towerRaw =
    raw.towerEnd ?? raw.towerAuto ?? raw.tower ?? raw.towerLevel ?? "N/A";

  const tower = String(towerRaw).replace(/^l/i, "N");

  // ✅ storage real do pit (0 se não existir)
  const storage = getStorageFromPit(pitData);

  // points por partida (estimado)
  const points = Number(
    raw.points ?? raw.totalPoints ?? raw.score ?? storage * totalCycles,
  );

  return {
    ...raw,
    autoCycles,
    teleopCycles,
    totalCycles,
    robotBroke,
    matchNumber,
    tower,
    points,
  };
}

export default function Dashboard() {
  const { teamNumber } = useParams();
  const navigate = useNavigate();

  const [pit, setPit] = useState(null);
  const [scouts, setScouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  let safeTeamName = "";
  try {
    safeTeamName = getTeamNameByNumber(teamNumber);
  } catch (e) {
    console.error("Erro em getTeamNameByNumber:", e);
    safeTeamName = "";
  }

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      setErrorMsg("");

      try {
        const teamScouts = await fetchMyTeamScouts(teamNumber);

        // pit opcional
        let pitData = null;
        try {
          pitData = await fetchMyTeamPitScout(teamNumber);
        } catch (_) {
          pitData = null;
        }

        setPit(pitData);

        const normalized = (Array.isArray(teamScouts) ? teamScouts : []).map(
          (raw) => normalizeScout(raw, pitData),
        );

        setScouts(normalized);
      } catch (err) {
        console.error(err);
        setErrorMsg("Erro ao carregar dados.");
        setScouts([]);
        setPit(null);
      } finally {
        setLoading(false);
      }
    }

    loadAll();
  }, [teamNumber]);

  const metrics = useMemo(() => {
    const n = scouts.length;

    const brokeOnes = scouts.filter((s) => Number(s.robotBroke) === 1).length;
    const brokeZeros = scouts.filter((s) => Number(s.robotBroke) === 0).length;

    const totalRounds = brokeOnes + brokeZeros;
    const breakRate = totalRounds > 0 ? brokeOnes / totalRounds : 0;
    const breakRatePercent = (breakRate * 100).toFixed(1);

    const cyclesArr = scouts.map((s) => Number(s.totalCycles ?? 0));
    const avgCycles = n
      ? Math.round(cyclesArr.reduce((a, b) => a + b, 0) / n)
      : 0;

    const storage = getStorageFromPit(pit);
    const avgPoints = storage > 0 ? Math.round(storage * avgCycles) : null;

    const maxCycles = n ? Math.max(...cyclesArr) : 0;

    const towerDist = scouts.reduce((acc, s) => {
      const k = s.tower ?? "N/A";
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});

    const withMatch = scouts
      .map((s, idx) => ({
        label:
          s.matchNumber != null ? `Match ${s.matchNumber}` : `Match ${idx + 1}`,
        value: Number(s.totalCycles ?? 0),
        sortKey: s.matchNumber != null ? Number(s.matchNumber) : idx + 1,
      }))
      .sort((a, b) => a.sortKey - b.sortKey);

    return {
      total: n,
      brokeOnes,
      brokeZeros,
      breakRatePercent,
      avgCycles,
      avgPoints,
      storage,
      towerDist,
      chartLabels: withMatch.map((x) => x.label),
      chartValues: withMatch.map((x) => x.value),
      maxCycles,
    };
  }, [scouts, pit]);

  const pieData = useMemo(() => {
    const labels = Object.keys(metrics.towerDist);
    const values = Object.values(metrics.towerDist);

    return {
      labels,
      datasets: [
        {
          label: "Tower",
          data: values,
          backgroundColor: labels.map(
            (_, i) => PIE_COLORS[i % PIE_COLORS.length],
          ),
          borderWidth: 1,
        },
      ],
    };
  }, [metrics.towerDist]);

  const barData = useMemo(() => {
    return {
      labels: metrics.chartLabels,
      datasets: [
        {
          label: "Ciclos por Partida",
          data: metrics.chartValues,
          backgroundColor: metrics.chartLabels.map(
            (_, i) => BAR_COLORS[i % BAR_COLORS.length],
          ),
          borderWidth: 1,
        },
      ],
    };
  }, [metrics.chartLabels, metrics.chartValues]);

  const barOptions = useMemo(() => {
    const safeMax = Math.max(1, Number(metrics.maxCycles || 0));

    return {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: safeMax,
          ticks: { precision: 0 },
        },
      },
    };
  }, [metrics.maxCycles]);

  const pieOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            font: { size: 16 },
            boxWidth: 14,
            padding: 14,
          },
        },
        tooltip: {
          bodyFont: { size: 16 },
          titleFont: { size: 16 },
        },
      },
    };
  }, []);

  return (
  <div
    className="
      w-full
      max-w-[520px] sm:max-w-[760px] md:max-w-[980px] lg:max-w-[1200px]
      bg-white flex flex-col text-black
      p-4 sm:p-5 md:p-6
      mt-4 sm:mt-5 mb-4 sm:mb-5
      rounded-[16px] sm:rounded-[18px] md:rounded-[20px]
      border-2 border-[#E7E7E9]
    "
  >
    <div className="flex justify-between items-center gap-3 mb-4">
      <h1 className="text-xl sm:text-2xl font-bold">
        Dashboard #{teamNumber}: {safeTeamName}
      </h1>

      <button
        type="button"
        className="w-10 h-10 cursor-pointer"
        onClick={() => navigate("/ranking")}
        title="Voltar"
        aria-label="Voltar"
      >
        <img src={sair} alt="Voltar" />
      </button>
    </div>

    {loading ? (
      <div className="py-6 text-[#2e2e2e]">Carregando dados do time...</div>
    ) : errorMsg ? (
      <div className="py-6 text-[#b00020]">{errorMsg}</div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 4 primeiros itens: grid 2x2 (em md+) */}
        <div className="p-4 border-2 border-[#E7E7E9] rounded-lg text-lg sm:text-xl">
          <p className="font-semibold mb-2">Total de Scouts:</p>
          <p className="font-normal text-2xl sm:text-3xl">
            {metrics.total} partidas
          </p>
        </div>

        <div className="p-4 border-2 border-[#E7E7E9] rounded-lg text-lg sm:text-xl">
          <p className="font-semibold mb-2">Taxa de Quebras:</p>
          <p className="font-normal text-2xl sm:text-3xl">
            {metrics.breakRatePercent}% ({metrics.brokeOnes}/
            {metrics.brokeOnes + metrics.brokeZeros})
          </p>
        </div>

        <div className="p-4 border-2 border-[#E7E7E9] rounded-lg text-lg sm:text-xl">
          <p className="font-semibold mb-2">Média de Ciclos:</p>
          <p className="font-normal text-2xl sm:text-3xl">
            {metrics.avgCycles} ciclos por partida
          </p>
        </div>

        <div className="p-4 border-2 border-[#E7E7E9] rounded-lg text-lg sm:text-xl">
          <p className="font-semibold mb-2">Média de Pontos:</p>

          {metrics.avgPoints == null ? (
            <p className="text-gray-500 text-2xl sm:text-3xl">N/A (sem Pit)</p>
          ) : (
            <p className="font-normal text-2xl sm:text-3xl">
              {metrics.avgPoints} pts
              <span className="text-sm sm:text-base text-gray-500">
                {" "}
                (storage {metrics.storage} × {metrics.avgCycles})
              </span>
            </p>
          )}
        </div>

        {/* Gráfico 1: pega a linha inteira (col-span-2 no md+) */}
        <div className="md:col-span-2 p-4 border-2 border-[#E7E7E9] rounded-lg text-lg sm:text-xl">
          <p className="font-semibold mb-2">Gráfico dos ciclos em Partida:</p>
          {metrics.total === 0 ? (
            <p className="text-[#2e2e2e]">Sem dados para exibir.</p>
          ) : (
            <Bar data={barData} options={barOptions} />
          )}
        </div>

        {/* Gráfico 2: pega a linha inteira (col-span-2 no md+) */}
        <div className="md:col-span-2 p-4 border-2 border-[#E7E7E9] rounded-lg text-lg sm:text-xl">
          <p className="font-semibold mb-2">Distribuição da Tower:</p>

          {Object.keys(metrics.towerDist).length === 0 ? (
            <p className="font-normal">N/A</p>
          ) : (
            <div className="h-72 sm:h-80">
              <Pie data={pieData} options={pieOptions} />
            </div>
          )}
        </div>
      </div>
    )}
  </div>
);

}
