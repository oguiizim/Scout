import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import back from "../../assets/icons8-voltar.png";

import { TEAMS } from "../../data/Teams.js";
import { fetchMyTeamPitScout } from "../../api/services/dashboard.js"; // ajuste o caminho se necessário

const MAP = {
  driveTrain: {
    swerve: "Swerve Drive",
    tank: "Tank Drive",
  },
  shooter: {
    turret: "Torreta",
    pivot: "Pivot",
    fixed: "Fixo",
    other: "Outro",
  },
  intake: {
    "4bar": "4 Bar / Linkage",
    pivot: "Pivot",
    inside_bumper: "Dentro do Bumper",
    other: "Outro",
  },
  trenchOrBump: {
    trench: "Trincheira",
    bump: "Bump",
    both: "Ambos",
  },
  tower: {
    none: "Nenhum",
    l1: "L1",
    l2: "L2",
    l3: "L3",
  },
};

function Field({ label, value }) {
  return (
    <div className="rounded-xl border-2 border-[#E7E7E9] bg-white/5 p-4">
      <p className="text-xl font-bold tracking-wide text-black/60">{label}</p>
      <p className="mt-2 text-medium font-normal text-black">
        {value !== undefined &&
        value !== null &&
        String(value).trim() !== "" ? (
          value
        ) : (
          <span className="text-black/50">—</span>
        )}
      </p>
    </div>
  );
}

export default function PitScoutPage() {
  const navigate = useNavigate();
  const { teamNumber } = useParams();

  const [loading, setLoading] = useState(true);
  const [pit, setPit] = useState(null);

  const teamInfo = useMemo(() => {
    const t = TEAMS.find((x) => String(x.number) === String(teamNumber));
    return t ? `${t.name} #${t.number}` : `Time #${teamNumber}`;
  }, [teamNumber]);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        const data = await fetchMyTeamPitScout(teamNumber);
        if (!alive) return;
        setPit(data); // objeto ScoutPit
      } catch (e) {
        if (!alive) return;
        setPit(null);
        toast.error("Não foi possível carregar o Pit Scouting.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [teamNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ffffff] text-black p-6">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 px-4 py-2 rounded-lg bg-white border-[#E7E7E9] border-2 items-center flex cursor-pointer"
          >
            <img src={back} alt="Voltar" className="w-4 h-4 mr-2 inline" />
            <p className="text-xl">Voltar</p>
          </button>
          <p className="text-black/70">Carregando Pit Scouting…</p>
        </div>
      </div>
    );
  }

  if (!pit) {
    return (
      <div className="min-h-screen bg-[#ffffff] text-black p-6">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 px-4 py-2 rounded-lg bg-white border-[#E7E7E9] border-2 items-center flex cursor-pointer hover:bg-[#F1F5F9] transition-all duration-150"
          >
            <img src={back} alt="Voltar" className="w-4 h-4 mr-2 inline" />
            <p className="text-xl">Voltar</p>
          </button>

          <h1 className="text-2xl font-semibold">Pit Scouting</h1>
          <p className="mt-1 text-black/70">{teamInfo}</p>

          <p className="mt-6 text-black/70">
            Nenhum registro de Pit Scouting encontrado para este time.
          </p>

          <div className="mt-6 flex gap-2 flex-wrap">
            <button
              onClick={() => navigate(`/dashboard/${teamNumber}`)}
              className="px-4 py-2 rounded-lg bg-white border-[#E7E7E9] border-2 cursor-pointer hover:bg-[#F1F5F9] transition-all duration-150"
            >
              Ir para Dashboard
            </button>

            <button
              onClick={() => navigate(`/scout/p?team=${teamNumber}`)}
              className="px-4 py-2 rounded-lg bg-white border-[#E7E7E9] border-2 hover:bg-[#0F172A] hover:border-[#0F172A] hover:text-white cursor-pointer transition-all duration-150"
            >
              Fazer Pit Scouting
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Valores “humanizados”
  const driveTrain = MAP.driveTrain[pit.driveTrain] ?? pit.driveTrain;
  const shooter = MAP.shooter[pit.shooter] ?? pit.shooter;
  const intake = MAP.intake[pit.intake] ?? pit.intake;
  const trenchOrBump = MAP.trenchOrBump[pit.trenchOrBump] ?? pit.trenchOrBump;
  const tower = MAP.tower[pit.tower ?? "none"] ?? pit.tower;

  return (
    <div className="min-h-screen bg-[#ffffff] text-black p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="mb-4 px-4 py-2 rounded-lg bg-white border-[#E7E7E9] border-2 items-center flex cursor-pointer hover:bg-[#F1F5F9] transition-all duration-150"
            >
              <img src={back} alt="Voltar" className="w-4 h-4 mr-2 inline" />
              <p className="text-xl">Voltar</p>
            </button>

            <h1 className="text-3xl font-bold">Pit Scouting</h1>
            <p className="text-black/70 mt-1">{teamInfo}</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => navigate(`/dashboard/${teamNumber}`)}
              className="px-4 py-2 rounded-lg bg-white border-[#E7E7E9] border-2 cursor-pointer hover:bg-[#F1F5F9] transition-all duration-150"
            >
              Ir para Dashboard
            </button>

            <button
              onClick={() => navigate(`/scout/p?team=${teamNumber}`)}
              className="px-4 py-2 rounded-lg bg-white border-[#E7E7E9] border-2 hover:bg-[#0F172A] hover:border-[#0F172A] hover:text-white cursor-pointer transition-all duration-150"
            >
              Editar / Novo Pit
            </button>
          </div>
        </div>

        {/* Team + Robot */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nº do Time" value={pit.team} />
          <Field label="Nome do robô" value={pit.robotName} />
        </div>

        {/* Mecanismos */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Tipo de Drive Train" value={driveTrain} />
          <Field label="Tipo de Shooter" value={shooter} />
          <Field label="Tipo de Intake" value={intake} />
          <Field label="Trincheira ou Bump" value={trenchOrBump} />
          <Field label="Nível de Escalada" value={tower} />
          <Field label="Capacidade de Armazenamento" value={pit.storage} />
        </div>

        {/* Auto rotas */}
        <div className="mt-8 rounded-2xl border-2 border-[#E7E7E9] bg-white/5 p-5">
          <h2 className="text-xl font-bold tracking-wide text-black/60">
            Quantidade de Auto rotas por posição
          </h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Esquerda" value={pit.autoLeft} />
            <Field label="Centro" value={pit.autoCenter} />
            <Field label="Direita" value={pit.autoRight} />
          </div>
        </div>

        {/* Ciclos */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Tempo médio p/Ciclo" value={pit.timeCycles} />
          <Field label="Quantidade de ciclos p/Break" value={pit.cycles} />
        </div>

        {/* Observações */}
        <div className="mt-8 rounded-2xl border-2 border-[#E7E7E9] bg-white/5 p-5">
          <h2 className="text-lg font-semibold">Observações</h2>
          <p className="mt-3 text-black/80 whitespace-pre-wrap">
            {pit.notes?.trim() ? pit.notes : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
