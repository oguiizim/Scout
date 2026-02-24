// pages/MatchPredictor.jsx (ou onde você preferir)
import { useState } from "react";
import { predictMatch } from "../../api/services/predictor.js";
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
    <main className="text-black flex flex-col min-h-screen items-center">
      <Navbar></Navbar>
      <div className="border-2 border-[#E7E7E9] w-[60%] rounded-2xl p-5 mt-5">
        <header>
          <h1 className="text-2xl font-bold mb-4">Previsor de Partidas:</h1>
        </header>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            <AllianceCard title="ALIANÇA VERMELHA" alliance="red">
              <TeamInput
                value={red.t1}
                onChange={handleChange(setRed, "t1")}
                placeholder="Time 1:"
                alliance="red"
              />
              <TeamInput
                value={red.t2}
                onChange={handleChange(setRed, "t2")}
                placeholder="Time 2:"
                alliance="red"
              />
              <TeamInput
                value={red.t3}
                onChange={handleChange(setRed, "t3")}
                placeholder="Time 3:"
                alliance="red"
              />
            </AllianceCard>

            <AllianceCard title="ALIANÇA AZUL" alliance="blue">
              <TeamInput
                value={blue.t1}
                onChange={handleChange(setBlue, "t1")}
                placeholder="Time 1:"
                alliance="blue"
              />
              <TeamInput
                value={blue.t2}
                onChange={handleChange(setBlue, "t2")}
                placeholder="Time 2:"
                alliance="blue"
              />
              <TeamInput
                value={blue.t3}
                onChange={handleChange(setBlue, "t3")}
                placeholder="Time 3:"
                alliance="blue"
              />
            </AllianceCard>
          </div>

          <div className="rounded-xl flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg text-black disabled:opacity-60 border-2 border-[#E7E7E9] hover:bg-[#0F172A] hover-border-0 hover:border-[#0F172A] hover:text-white transition-all duration-200"
            >
              {loading ? "Calculando..." : "Prever placar"}
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-lg border border-red-300 text-red-700 bg-red-50">
              {error}
            </div>
          )}
        </form>

        {result && (
          <section className="mt-6 grid gap-4">
            <ScoreCard red={result.final.red} blue={result.final.blue} />

            <div className="grid md:grid-cols-2 gap-4">
              <BreakdownCard title="Registros Red:" alliance={result.red} />
              <BreakdownCard title="Registros Blue:" alliance={result.blue} />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function AllianceCard({ title, children, alliance }) {
  const divClass =
    alliance === "red"
      ? "p-4 rounded-xl bg-[#FFB8B8] border-[#FF8A8A] border-2"
      : "p-4 rounded-xl bg-[#B8CEFF] border-[#5C8FFF] border-2";

  const titleClass =
    alliance === "red"
      ? "font-semibold mb-3 text-xl"
      : "font-semibold mb-3 text-xl";

  return (
    <div className={divClass}>
      <h2 className={titleClass}>{title}:</h2>
      <div className="grid gap-2">{children}</div>
    </div>
  );
}

function TeamInput({ value, onChange, placeholder, alliance }) {
  const inputClass =
    alliance === "red"
      ? "text-black w-full p-2 rounded-lg border-[#FF8A8A] bg-[#FAFAFA] border-2"
      : "text-black w-full p-2 rounded-lg border-[#5C8FFF] bg-[#FAFAFA] border-2";
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
      ? "p-4 rounded-xl border-2 bg-[#FFB8B8] border-[#FF8A8A]"
      : status === "blue"
        ? "p-4 rounded-xl border-2 bg-[#B8CEFF] border-[#5C8FFF]"
        : "p-4 rounded-xl border-2 bg-[#E7E7E9] border-[#BABABF]";

  return (
    <div className={containerClass}>
      <p className="text-sm opacity-70">Placar previsto</p>

      <div className="mt-2 flex items-end gap-4">
        <div>
          <p className="text-xs opacity-70">RED</p>
          <p className="text-4xl font-bold">{red}</p>
        </div>

        <p className="text-2xl opacity-50 mb-1">x</p>

        <div>
          <p className="text-xs opacity-70">BLUE</p>
          <p className="text-4xl font-bold">{blue}</p>
        </div>
      </div>

      <p className="mt-2 text-sm font-medium">{winnerText}</p>
    </div>
  );
}

function BreakdownCard({ title, alliance }) {
  return (
    <div className="p-4 rounded-xl border-[#E7E7E9] border-2">
      <h3 className="font-semibold">{title}</h3>

      <div className="mt-3 grid gap-2 text-sm">
        {alliance.details.map((d) => (
          <div
            key={d.teamNumber}
            className="flex items-center justify-between gap-3"
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

            <p className="font-semibold whitespace-nowrap">
              {Number(d.expectedPoints ?? 0).toFixed(1)} pts
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t flex justify-between font-semibold">
        <span>Total</span>
        <span>{Number(alliance.total ?? 0).toFixed(1)} pts</span>
      </div>
    </div>
  );
}
