// pages/MatchPredictor.jsx
import { useState } from "react";
import { predictMatch } from "../../api/services/predictor.js";
import { ClockPlus } from "lucide-react";
import Navbar from "../Components/Navbar.jsx";

export default function Preview() {
  const [red, setRed] = useState({ t1: "", t2: "", t3: "" });
  const [blue, setBlue] = useState({ t1: "", t2: "", t3: "" });

  const [pointsPerBall] = useState(1);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const parseAlliance = (obj) =>
    Object.values(obj)
      .map((v) => Number(String(v).trim()))
      .filter((n) => Number.isFinite(n) && n > 0);

  function handleChange(setter, key) {
    return (e) => setter((prev) => ({ ...prev, [key]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    const redTeams = parseAlliance(red);
    const blueTeams = parseAlliance(blue);

    if (redTeams.length !== 3 || blueTeams.length !== 3) {
      setError("Preencha exatamente 3 times em cada aliança.");
      return;
    }

    try {
      setLoading(true);

      const res = await predictMatch({
        redTeams,
        blueTeams,
        pointsPerBall: Number(pointsPerBall),
      });

      setResult(res);
    } catch (err) {
      console.error(err);
      setError("Erro ao calcular previsão. Verifique backend/serviços.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-text">
      <Navbar />

      {/* container */}
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        {/* card principal */}
        <div className="w-full rounded-2xl border-2 border-border p-4 sm:p-6 lg:p-8">
          <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex gap-3 items-center">
              <ClockPlus />
              <h1 className="text-xl font-bold sm:text-2xl">
                Previsor de Partidas:
              </h1>
            </div>

            {/* espaço p/ status rápido */}
            {result && (
              <p className="text-sm opacity-70">
                Última previsão gerada com sucesso
              </p>
            )}
          </header>

          <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:gap-5">
            {/* alianças */}
            <div className="grid gap-4 md:grid-cols-2">
              <AllianceCard title="ALIANÇA VERMELHA" alliance="red">
                <TeamInput
                  value={red.t1}
                  onChange={handleChange(setRed, "t1")}
                  placeholder="Time 1"
                  alliance="red"
                />
                <TeamInput
                  value={red.t2}
                  onChange={handleChange(setRed, "t2")}
                  placeholder="Time 2"
                  alliance="red"
                />
                <TeamInput
                  value={red.t3}
                  onChange={handleChange(setRed, "t3")}
                  placeholder="Time 3"
                  alliance="red"
                />
              </AllianceCard>

              <AllianceCard title="ALIANÇA AZUL" alliance="blue">
                <TeamInput
                  value={blue.t1}
                  onChange={handleChange(setBlue, "t1")}
                  placeholder="Time 1"
                  alliance="blue"
                />
                <TeamInput
                  value={blue.t2}
                  onChange={handleChange(setBlue, "t2")}
                  placeholder="Time 2"
                  alliance="blue"
                />
                <TeamInput
                  value={blue.t3}
                  onChange={handleChange(setBlue, "t3")}
                  placeholder="Time 3"
                  alliance="blue"
                />
              </AllianceCard>
            </div>

            {/* ações */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg border-2 border-border px-4 py-2 font-semibold transition-all duration-200 hover:bg-darkblue hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {loading ? "Calculando..." : "Prever placar"}
              </button>

              {/* dica/erro rápido (fica do lado no desktop) */}
              <p className="text-sm opacity-70 sm:text-right">
                Preencha 3 times por aliança
              </p>
            </div>

            {error && (
              <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-red-700">
                {error}
              </div>
            )}
          </form>

          {result && (
            <section className="mt-6 grid gap-4 sm:gap-5">
              <ScoreCard red={result.final.red} blue={result.final.blue} />

              <div className="grid gap-4 md:grid-cols-2">
                <BreakdownCard title="Registros Red:" alliance={result.red} />
                <BreakdownCard title="Registros Blue:" alliance={result.blue} />
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

function AllianceCard({ title, children, alliance }) {
  const divClass =
    alliance === "red"
      ? "rounded-xl border-2 border-borderred bg-lred p-4 text-black"
      : "rounded-xl border-2 border-borderblue bg-lblue p-4 text-black";

  return (
    <div className={divClass}>
      <h2 className="mb-3 text-lg font-semibold sm:text-xl">{title}</h2>
      <div className="grid gap-2">{children}</div>
    </div>
  );
}

function TeamInput({ value, onChange, placeholder, alliance }) {
  const inputClass =
    alliance === "red"
      ? "w-full rounded-lg border-2 border-borderred bg-[#FAFAFA] p-2 text-black outline-none focus:ring-2 focus:ring-borderred/40"
      : "w-full rounded-lg border-2 border-borderblue bg-[#FAFAFA] p-2 text-black outline-none focus:ring-2 focus:ring-borderblue/40";

  return (
    <input
      value={value}
      onChange={onChange}
      inputMode="numeric"
      className={inputClass}
      placeholder={placeholder}
    />
  );
}

function ScoreCard({ red, blue }) {
  const status = red === blue ? "tie" : red > blue ? "red" : "blue";

  const winnerText =
    status === "tie" ? "Empate" : status === "red" ? "Red vence" : "Blue vence";

  const containerClass =
    status === "red"
      ? "rounded-xl border-2 border-borderred bg-lred p-4 text-black"
      : status === "blue"
        ? "rounded-xl border-2 border-borderblue bg-lblue p-4 text-black"
        : "rounded-xl border-2 border-border bg-background p-4";

  return (
    <div className={containerClass}>
      <p className="text-sm opacity-70">Placar previsto</p>

      {/* no mobile empilha melhor */}
      <div className="mt-3 gap-3 sm:items-end sm:gap-6">
        <div className="flex gap-4 sm:block">
          <div>
            <p className="text-xs opacity-70">RED</p>
            <p className="text-4xl font-bold">{red}</p>
          </div>

          <p className="text-2xl opacity-50 sm:mb-1">x</p>

          <div className="text-right sm:text-left">
            <p className="text-xs opacity-70">BLUE</p>
            <p className="text-4xl font-bold">{blue}</p>
          </div>
        </div>
      </div>
      <p className="text-sm font-medium">{winnerText}</p>
    </div>
  );
}

function BreakdownCard({ title, alliance }) {
  return (
    <div className="rounded-xl border-2 border-border p-4">
      <h3 className="text-base font-semibold sm:text-lg">{title}</h3>

      <div className="mt-3 grid gap-3 text-sm">
        {alliance.details.map((d) => (
          <div
            key={d.teamNumber}
            className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
          >
            <div className="min-w-0">
              <p className="font-medium">Team {d.teamNumber}</p>
              <p className="text-xs opacity-70">
                Media de Ciclos: {Number(d.avgCycles ?? 0).toFixed(2)} ×
                Armazem: {d.capacity ?? 0} ={" "}
                {Number(d.expectedBalls ?? 0).toFixed(2)} fuels + Pontos da
                Tower: {Number(d.expectedTowerPoits)}
              </p>
            </div>

            <p className="font-semibold sm:whitespace-nowrap">
              {Number(d.expectedPoints ?? 0).toFixed(1)} pts
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t pt-3 font-semibold">
        <span>Total</span>
        <span>{Number(alliance.total ?? 0).toFixed(1)} pts</span>
      </div>
    </div>
  );
}
