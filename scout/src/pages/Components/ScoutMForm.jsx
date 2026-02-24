import { useEffect, useMemo, useRef, useState } from "react";
import { TEAMS } from "../../data/Teams.js";
import { submitMatchData } from "../../api/services/scoutMatch.js";
import toast, { Toaster } from "react-hot-toast";
import document_gif from "../../assets/document-gif.gif";

const initialState = {
  matchNumber: "",
  team: "",

  teamQuery: "",
  teamName: "",

  autoCycles: 0, // <- nome igual o JSON que você quer
  teleCycles: 0, // <- nome igual o JSON que você quer

  position: "",

  areBroke: false,
  autoWork: false,

  towerEnd: "none",
  towerAuto: "none",

  notes: "",
};

function ScoutMForm() {
  const [form, setForm] = useState(initialState);
  const [openTeams, setOpenTeams] = useState(false);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef(null);

  const setField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const onlyDigits = (s) => s.replace(/\D/g, "");

  const clampInt = (v) => {
    const n = Number.parseInt(String(v), 10);
    return Number.isFinite(n) ? n : 0;
  };

  const inc = (key) =>
    setForm((p) => ({ ...p, [key]: (Number(p[key]) || 0) + 1 }));

  const dec = (key) =>
    setForm((p) => ({ ...p, [key]: Math.max(0, (Number(p[key]) || 0) - 1) }));

  const isSelectedBtn = (current, value) =>
    current === value ? "bg-[#F1F5F9]" : "bg-[#ffffff]";

  const clearForm = () => {
    setForm(initialState);
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
      team: String(t.number), // guardo como string no state e converto no submit
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

  const saveRecord = async () => {
    const matchNumber = clampInt(form.matchNumber);
    const team = clampInt(form.team);

    if (!matchNumber) return toast.error("Preencha Nº da Partida.");
    if (!team)
      return toast.error("Selecione a equipe (pesquise e clique na lista).");
    if (!form.position) return toast.error("Selecione a Posição Inicial.");

    // ✅ payload 1:1 com seu JSON
    const payload = {
      matchNumber: Number(matchNumber),
      team: Number(team),
      autoCycles: Number(form.autoCycles),
      teleCycles: Number(form.teleCycles),
      position: form.position,
      areBroke: Boolean(form.areBroke),
      autoWork: Boolean(form.autoWork),
      towerEnd: form.towerEnd,
      towerAuto: form.towerAuto,
      notes: form.notes ?? "",
    };

    try {
      setLoading(true);
      await submitMatchData(payload); // <- chama seu service
      toast.success("Scout enviado com sucesso!");
      clearForm();
    } catch (err) {
      toast.error(err?.message || "Erro ao enviar scout para a API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
      w-full
      max-w-[520px] sm:max-w-[640px] md:max-w-[760px] lg:max-w-[900px]
      bg-white flex flex-col text-black
      p-4 sm:p-5 md:p-6
      mt-4 sm:mt-5 mb-4 sm:mb-5
      rounded-[16px] sm:rounded-[18px] md:rounded-[20px]
      border-2 border-[#E7E7E9]
    "
    >
      <div className="flex gap-2 mb-4 items-center">
        <img src={document_gif} className="w-7" />
        <h1 className="font-bold text-xl sm:text-2xl">Novo Scout</h1>
      </div>

      {/* Team and Match Number */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4 md:gap-5 mb-4">
        {/* Match */}
        <div className="w-full md:w-1/2">
          <h1 className="mb-2.5 sm:mb-3.5 font-semibold">Nº da Partida:</h1>
          <input
            type="text"
            placeholder="Ex: 7"
            className="w-full px-4 py-2 rounded-lg border-2 border-[#E7E7E9]"
            value={form.matchNumber}
            inputMode="numeric"
            pattern="[0-9]*"
            onChange={(e) =>
              setField("matchNumber", onlyDigits(e.target.value))
            }
          />
        </div>

        {/* Team (busca + dropdown overlay) */}
        <div className="w-full md:w-1/2 relative" ref={dropdownRef}>
          <h1 className="mb-2.5 sm:mb-3.5 font-semibold">Equipe (pesquise):</h1>

          <input
            type="text"
            placeholder="Ex: 8882, Hydra, SESI..."
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

          {openTeams && (
            <div className="absolute left-0 top-full mt-2 w-full max-h-56 overflow-auto rounded-lg border-2 border-[#E7E7E9] bg-white z-50 shadow-lg">
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
            <p className="mt-2 text-sm text-[#2e2e2e]">
              Selecionado: {form.teamName} #{form.team}
            </p>
          )}
        </div>
      </div>

      {/* Initial Position */}
      <div className="mb-4">
        <h1 className="mb-2.5 sm:mb-3.5 font-semibold">Posição Inicial:</h1>
        <div className="w-full flex flex-row justify-between gap-2 hover:cursor-pointer">
          <button
            type="button"
            onClick={() => setField("position", "left")}
            className={`py-2 w-1/3 flex justify-center rounded-lg hover:bg-[#F1F5F9] ${isSelectedBtn(
              form.position,
              "left",
            )}`}
          >
            Esquerda
          </button>
          <button
            type="button"
            onClick={() => setField("position", "center")}
            className={`py-2 w-1/3 flex justify-center rounded-lg hover:bg-[#F1F5F9] ${isSelectedBtn(
              form.position,
              "center",
            )}`}
          >
            Centro
          </button>
          <button
            type="button"
            onClick={() => setField("position", "right")}
            className={`py-2 w-1/3 flex justify-center rounded-lg hover:bg-[#F1F5F9] ${isSelectedBtn(
              form.position,
              "right",
            )}`}
          >
            Direita
          </button>
        </div>
      </div>

      {/* Cycles Counter */}
      <div className="mb-4 flex flex-col md:flex-row md:justify-between gap-4 md:gap-5">
        <div className="w-full md:w-1/2">
          <h1 className="font-semibold mb-3 sm:mb-4">
            Ciclos Completados Auto:
          </h1>
          <div className="w-full flex flex-row gap-4 sm:gap-5 items-center">
            <button
              type="button"
              onClick={() => dec("autoCycles")}
              className="text-xl w-12 h-12 sm:w-14 sm:h-14 cursor-pointer border-2 border-[#E7E7E9] rounded-lg hover:bg-[#F1F5F9] font-bold"
            >
              -
            </button>
            <h1 className="text-5xl sm:text-6xl flex justify-center items-center">
              {form.autoCycles}
            </h1>
            <button
              type="button"
              onClick={() => inc("autoCycles")}
              className="text-3xl w-12 h-12 sm:w-14 sm:h-14 cursor-pointer border-2 border-[#E7E7E9] rounded-lg hover:bg-[#F1F5F9] font-bold"
            >
              +
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <h1 className="font-semibold mb-3 sm:mb-4">
            Ciclos Completados Teleop:
          </h1>
          <div className="w-full flex flex-row gap-4 sm:gap-5 items-center">
            <button
              type="button"
              onClick={() => dec("teleCycles")}
              className="text-xl w-12 h-12 sm:w-14 sm:h-14 cursor-pointer border-2 border-[#E7E7E9] rounded-lg hover:bg-[#F1F5F9] font-bold"
            >
              -
            </button>
            <h1 className="text-5xl sm:text-6xl flex justify-center items-center">
              {form.teleCycles}
            </h1>
            <button
              type="button"
              onClick={() => inc("teleCycles")}
              className="text-3xl w-12 h-12 sm:w-14 sm:h-14 cursor-pointer border-2 border-[#E7E7E9] rounded-lg hover:bg-[#F1F5F9] font-bold"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex items-center mb-4">
        <label className="mr-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            className="peer hidden"
            checked={form.areBroke}
            onChange={(e) => setField("areBroke", e.target.checked)}
          />
          <span
            className="
            w-5 h-5 rounded-md border border-[#343434]
            flex items-center justify-center transition
            peer-checked:bg-[#dbe9f6] peer-checked:border-[#dbe9f6]
          "
          ></span>
        </label>
        <h1 className="font-semibold items-center">
          Robô quebrou durante a partida
        </h1>
      </div>

      <div className="flex items-center mb-4">
        <label className="mr-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            className="peer hidden"
            checked={form.autoWork}
            onChange={(e) => setField("autoWork", e.target.checked)}
          />
          <span
            className="
            w-5 h-5 rounded-md border border-[#343434]
            flex items-center justify-center transition
            peer-checked:bg-[#dbe9f6] peer-checked:border-[#dbe9f6]
          "
          ></span>
        </label>
        <h1 className="font-semibold items-center">
          Autônomo funcionou como deveria
        </h1>
      </div>

      {/* Endgame */}
      <div className="mb-4">
        <h1 className="mb-2.5 sm:mb-3.5 font-semibold">Endgame:</h1>

        <div className="w-full md:w-[65%] grid grid-cols-2 sm:grid-cols-4 gap-2 hover:cursor-pointer">
          {[
            ["none", "Nenhum"],
            ["l1", "Nivel 1"],
            ["l2", "Nivel 2"],
            ["l3", "Nivel 3"],
          ].map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setField("towerEnd", val)}
              className={`py-2 w-full flex justify-center rounded-lg hover:bg-[#F1F5F9] ${isSelectedBtn(
                form.towerEnd,
                val,
              )}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Climbing on Auto */}
      <div className="mb-4">
        <h1 className="mb-2.5 sm:mb-3.5 font-semibold">Escalado no Auto:</h1>

        <div className="w-full md:w-[65%] grid grid-cols-2 sm:grid-cols-4 gap-2 hover:cursor-pointer">
          {[
            ["none", "Nenhum"],
            ["l1", "Nivel 1"],
            ["l2", "Nivel 2"],
            ["l3", "Nivel 3"],
          ].map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setField("towerAuto", val)}
              className={`py-2 w-full flex justify-center rounded-lg hover:bg-[#F1F5F9] ${isSelectedBtn(
                form.towerAuto,
                val,
              )}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Observations */}
      <div className="mb-4">
        <div className="w-full">
          <h1 className="mb-2.5 sm:mb-3.5 font-semibold">Observações:</h1>
          <input
            type="text"
            placeholder="Ex: Robô tem a estratégia x..."
            className="w-full px-4 py-2 rounded-lg border-2 border-[#E7E7E9]"
            value={form.notes}
            onChange={(e) => setField("notes", e.target.value)}
          />
        </div>
      </div>

      {/* Save / Clear */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-2">
        <button
          type="button"
          onClick={saveRecord}
          disabled={loading}
          className="w-full sm:w-1/2 flex justify-center bg-[#0F172A] text-white rounded-lg py-2 cursor-pointer hover:bg-[#141e37] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Enviando..." : "Salvar"}
        </button>

        <button
          type="button"
          onClick={clearForm}
          disabled={loading}
          className="w-full sm:w-1/2 flex justify-center bg-white text-black rounded-lg py-2 cursor-pointer hover:bg-[#0F172A] hover:text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Limpar
        </button>
      </div>
    </div>
  );
}

export default ScoutMForm;
