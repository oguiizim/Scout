import { useEffect, useMemo, useRef, useState } from "react";
import { TEAMS } from "../../data/Teams.js";
import { submitPitData } from "../../api/services/scoutPit.js";
import toast from "react-hot-toast";

const initialFormState = {
  team: "", // number (string no state, converte no submit)
  teamQuery: "",
  teamName: "",

  robotName: "",

  driveTrain: "", // "swerve" | "tank"
  shooter: "", // "turret" | "pivot" | "fixed" | "other"
  intake: "", // "4bar" | "pivot" | "inside_bumper" | "other"
  trenchOrBump: "", // "trench" | "bump" | "both"

  autoLeft: 0,
  autoCenter: 0,
  autoRight: 0,

  tower: "none", // "none" | "l1" | "l2" | "l3"

  storage: 0,
  timeCycles: 0.0, // float
  cycles: 0,

  notes: "none",
};

function ScoutPForm() {
  const [form, setForm] = useState(initialFormState);
  const [openTeams, setOpenTeams] = useState(false);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef(null);

  const setField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const onlyDigits = (s) => s.replace(/\D/g, "");

  const onlyDecimal = (s) =>
    s
      .replace(",", ".")
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1");

  const clampInt = (v) => {
    const n = Number.parseInt(String(v), 10);
    return Number.isFinite(n) ? n : 0;
  };

  const clampFloat = (v) => {
    const n = Number.parseFloat(String(v));
    return Number.isFinite(n) ? n : 0;
  };

  const isSelectedBtn = (current, value) =>
    current === value ? "bg-[#F1F5F9]" : "bg-[#ffffff]";

  const clearForm = () => {
    setForm(initialFormState);
    setOpenTeams(false);
  };

  const filteredTeams = useMemo(() => {
    const q = (form.teamQuery || "").trim().toLowerCase();
    if (!q) return TEAMS;

    return TEAMS.filter((t) => {
      const byNum = String(t.number).includes(q);
      const byName = t.name.toLowerCase().includes(q);
      return byNum || byName;
    });
  }, [form.teamQuery]);

  const selectTeam = (t) => {
    setForm((p) => ({
      ...p,
      team: String(t.number),
      teamName: t.name,
      teamQuery: `${t.name} #${t.number}`,
    }));
    setOpenTeams(false);
  };

  // fecha dropdown ao clicar fora
  useEffect(() => {
    const onDown = (e) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) setOpenTeams(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const savePit = async () => {
    const team = clampInt(form.team);
    if (!team) return toast.error("Selecione um time.");

    if (!form.robotName.trim()) return toast.error("Preencha o nome do robô.");
    if (!form.driveTrain) return toast.error("Selecione o Drive Train.");
    if (!form.shooter) return toast.error("Selecione o tipo de Shooter.");
    if (!form.intake) return toast.error("Selecione o tipo de Intake.");
    if (!form.trenchOrBump) return toast.error("Selecione Trincheira/Bump.");
    if (!form.tower) return toast.error("Selecione o nível de Escalada.");
    if(!form.cycles) return toast.error("Preencha a quantidade de ciclos p/Break.");
    if(!form.timeCycles) return toast.error("Preencha o tempo médio p/Ciclo.");

    const payload = {
      team, // number
      robotName: form.robotName.trim(),
      driveTrain: form.driveTrain,
      shooter: form.shooter,
      intake: form.intake,
      trenchOrBump: form.trenchOrBump,

      autoLeft: clampInt(form.autoLeft),
      autoCenter: clampInt(form.autoCenter),
      autoRight: clampInt(form.autoRight),

      tower: form.tower || "none",
      storage: clampInt(form.storage),
      timeCycles: clampFloat(form.timeCycles),
      cycles: clampInt(form.cycles),

      notes: form.notes ?? "",
    };

    try {
      setLoading(true);
      await submitPitData(payload);
      toast.success("Scout Pit enviado com sucesso!");
      clearForm();
    } catch (err) {
      toast.error(err?.message || "Erro ao enviar Scout Pit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[40vw] bg-[#ffffff] flex flex-col text-[#000000] p-6 mt-5 mb-5 rounded-[20px] border-2 border-[#E7E7E9]">
      <h1 className="font-bold text-2xl justify-start mb-4">Novo Scout Pit</h1>

      {/* Team + Robot Name */}
      <div className="flex flex-row justify-between gap-2 mb-4">
        {/* Team dropdown overlay */}
        <div
          className="w-[50%] flex flex-col mb-3.5 font-semibold relative"
          ref={dropdownRef}
        >
          <h1 className="mb-3.5">Nº do Time:</h1>

          <input
            type="text"
            placeholder="Ex: 8882, SESI, Hydra..."
            className="w-full px-4 py-2 rounded-lg border-2 border-[#E7E7E9]"
            value={form.teamQuery}
            onChange={(e) => {
              setField("teamQuery", e.target.value);
              setField("team", "");
              setField("teamName", "");
              setOpenTeams(true);
            }}
            onFocus={() => setOpenTeams(true)}
          />

          {/* ✅ overlay: não empurra nada pra baixo */}
          {openTeams && (
            <div className="absolute top-[92px] left-0 w-full max-h-56 overflow-auto rounded-lg border-2 border-[#E7E7E9] bg-white z-50 shadow-lg">
              {filteredTeams.length === 0 ? (
                <div className="px-4 py-3 text-[#2e2e2e]">
                  Nenhuma equipe encontrada.
                </div>
              ) : (
                filteredTeams.map((t) => (
                  <button
                    key={t.number}
                    type="button"
                    onClick={() => selectTeam(t)}
                    className="w-full text-left px-4 py-2 hover:bg-[#F1F5F9] transition-all duration-150"
                  >
                    {t.name} <span className="text-[#2e2e2e]">#{t.number}</span>
                  </button>
                ))
              )}
            </div>
          )}

          {form.team && (
            <p className="mt-2 text-sm font-normal text-[#2e2e2e]">
              Selecionado: {form.teamName} #{form.team}
            </p>
          )}
        </div>

        {/* Robot name */}
        <div className="w-[50%] flex flex-col">
          <h1 className="mb-3.5 font-semibold">Nome do robô:</h1>
          <input
            type="text"
            placeholder="Ex: Doppler"
            className="w-full px-4 py-2 rounded-lg border-2 border-[#E7E7E9]"
            value={form.robotName}
            onChange={(e) => setField("robotName", e.target.value)}
          />
        </div>
      </div>

      {/* DriveBase */}
      <div className="flex flex-col mb-4">
        <h1 className="font-semibold mb-3.5">Tipo de Drive Train:</h1>
        <div className="flex flex-row justify-between gap-2">
          <button
            type="button"
            onClick={() => setField("driveTrain", "swerve")}
            className={`w-[50%] py-2 rounded-lg hover:bg-[#F1F5F9] transition-all duration-200 cursor-pointer ${isSelectedBtn(
              form.driveTrain,
              "swerve",
            )}`}
          >
            Swerve Drive
          </button>
          <button
            type="button"
            onClick={() => setField("driveTrain", "tank")}
            className={`w-[50%] py-2 rounded-lg hover:bg-[#F1F5F9] transition-all duration-200 cursor-pointer ${isSelectedBtn(
              form.driveTrain,
              "tank",
            )}`}
          >
            Tank Drive
          </button>
        </div>
      </div>

      {/* Shooter */}
      <div className="flex flex-col mb-4">
        <h1 className="font-semibold mb-3.5">Tipo de Shooter:</h1>
        <div className="flex flex-row justify-between gap-2">
          {[
            ["turret", "Torreta"],
            ["pivot", "Pivot"],
            ["fixed", "Fixo"],
            ["other", "Outro"],
          ].map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setField("shooter", val)}
              className={`w-[25%] py-2 rounded-lg hover:bg-[#F1F5F9] transition-all duration-200 cursor-pointer ${isSelectedBtn(
                form.shooter,
                val,
              )}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Intake */}
      <div className="flex flex-col mb-4">
        <h1 className="font-semibold mb-3.5">Tipo de Intake:</h1>
        <div className="flex flex-row justify-between gap-2">
          {[
            ["4bar", "4 Bar / Linkage"],
            ["pivot", "Pivot"],
            ["inside_bumper", "Dentro do Bumper"],
            ["other", "Outro"],
          ].map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setField("intake", val)}
              className={`w-[25%] py-2 rounded-lg hover:bg-[#F1F5F9] transition-all duration-200 cursor-pointer ${isSelectedBtn(
                form.intake,
                val,
              )}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Trench/Bump */}
      <div className="flex flex-col mb-4">
        <h1 className="font-semibold mb-3.5">Trincheira ou Bump:</h1>
        <div className="flex flex-row justify-between gap-2">
          {[
            ["trench", "Trincheira"],
            ["bump", "Bump"],
            ["both", "Ambos"],
          ].map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setField("trenchOrBump", val)}
              className={`w-[33%] py-2 rounded-lg hover:bg-[#F1F5F9] transition-all duration-200 cursor-pointer ${isSelectedBtn(
                form.trenchOrBump,
                val,
              )}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Auto Routes */}
      <div className="flex flex-col mb-4">
        <h1 className="font-semibold mb-3.5">
          Quantidade de Auto rotas por posição:
        </h1>
        <div className="flex flex-row gap-2">
          <input
            type="text"
            placeholder="Esquerda"
            className="w-[33%] px-4 py-2 rounded-lg border-2 border-[#E7E7E9]"
            value={form.autoLeft}
            inputMode="numeric"
            onChange={(e) => setField("autoLeft", onlyDigits(e.target.value))}
          />
          <input
            type="text"
            placeholder="Centro"
            className="w-[33%] px-4 py-2 rounded-lg border-2 border-[#E7E7E9]"
            value={form.autoCenter}
            inputMode="numeric"
            onChange={(e) => setField("autoCenter", onlyDigits(e.target.value))}
          />
          <input
            type="text"
            placeholder="Direita"
            className="w-[33%] px-4 py-2 rounded-lg border-2 border-[#E7E7E9]"
            value={form.autoRight}
            inputMode="numeric"
            onChange={(e) => setField("autoRight", onlyDigits(e.target.value))}
          />
        </div>
      </div>

      {/* Storage */}
      <div className="flex flex-col mb-4">
        <h1 className="font-semibold mb-3.5">Capacidade de Armazenamento:</h1>
        <input
          type="text"
          placeholder="Ex: 26"
          className="w-[50%] px-4 py-2 rounded-lg border-2 border-[#E7E7E9]"
          value={form.storage}
          inputMode="numeric"
          onChange={(e) => setField("storage", onlyDigits(e.target.value))}
        />
      </div>

      {/* Tower */}
      <div className="flex flex-col mb-4">
        <h1 className="font-semibold mb-3.5">Nivel de Escalada:</h1>
        <div className="flex flex-row justify-between gap-2">
          {[
            ["none", "Nenhum"],
            ["l1", "L1"],
            ["l2", "L2"],
            ["l3", "L3"],
          ].map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setField("tower", val)}
              className={`w-[25%] py-2 rounded-lg hover:bg-[#F1F5F9] transition-all duration-200 cursor-pointer ${isSelectedBtn(
                form.tower,
                val,
              )}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Time per cycle */}
      <div className="flex flex-col mb-4">
        <h1 className="font-semibold mb-3.5">Tempo médio p/Ciclo:</h1>
        <input
          type="text"
          placeholder="Ex: 7.65"
          className="w-[50%] px-4 py-2 rounded-lg border-2 border-[#E7E7E9]"
          value={form.timeCycles}
          inputMode="decimal"
          onChange={(e) => setField("timeCycles", onlyDecimal(e.target.value))}
        />
      </div>

      {/* Cycles */}
      <div className="flex flex-col mb-4">
        <h1 className="font-semibold mb-3.5">Quantidade de ciclos p/Break:</h1>
        <input
          type="text"
          placeholder="Ex: 2"
          className="w-[50%] px-4 py-2 rounded-lg border-2 border-[#E7E7E9]"
          value={form.cycles}
          inputMode="numeric"
          onChange={(e) => setField("cycles", onlyDigits(e.target.value))}
        />
      </div>

      {/* Notes */}
      <div className="flex flex-col mb-4">
        <h1 className="font-semibold mb-3.5">Observações:</h1>
        <input
          type="text"
          placeholder="Ex: Atira em qualquer local da arena"
          className="w-full px-4 py-2 rounded-lg border-2 border-[#E7E7E9]"
          value={form.notes}
          onChange={(e) => setField("notes", e.target.value)}
        />
      </div>

      {/* Save / Clear */}
      <div className="flex flex-row justify-between gap-2">
        <button
          type="button"
          onClick={savePit}
          disabled={loading}
          className="w-[50%] flex justify-center bg-[#0F172A] text-white rounded-lg py-2 cursor-pointer hover:bg-[#141e37] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Enviando..." : "Salvar"}
        </button>

        <button
          type="button"
          onClick={clearForm}
          disabled={loading}
          className="w-[50%] flex justify-center bg-[#ffffff] text-black rounded-lg py-2 cursor-pointer hover:bg-[#0F172A] hover:text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Limpar
        </button>
      </div>
    </div>
  );
}

export default ScoutPForm;
