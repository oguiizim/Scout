import { useEffect, useMemo, useRef, useState } from "react";

function ScoutMForm() {
  // ✅ lista de equipes (as que você mandou)
  const TEAMS = useMemo(
    () => [
      { number: 1156, name: "Under Control" },
      { number: 1860, name: "Alphabots" },
      { number: 3986, name: "Express-O" },
      { number: 7459, name: "Taubatexas Robotics" },
      { number: 7563, name: "SESI SENAI MEGAZORD" },
      { number: 7565, name: "SESI SENAI ROBONÁTICOS" },
      { number: 7567, name: "SESI SENAI OCTOPUS" },
      { number: 8066, name: "WOLF ARMY ROBOTICS" },
      { number: 8882, name: "INFINITY BR" },

      { number: 9045, name: "North Lions SESI/SENAI" },
      { number: 9046, name: "SESI SENAI BBTECH" },
      { number: 9047, name: "TECHMAKER ROBOTICS" },
      { number: 9048, name: "SESI/SENAI POTIBAT" },
      { number: 9049, name: "SESI SENAI STEAMPUNK MONKEY FRC" },
      { number: 9050, name: "Tucanus" },
      { number: 9066, name: "Cavalo Vendado" },
      { number: 9085, name: "SESI SENAI MEGA HARPY" },
      { number: 9110, name: "SESI SENAI Atomic" },
      { number: 9162, name: "ALL MIGHT" },
      { number: 9163, name: "HYDRA" },
      { number: 9164, name: "Tech Vikings" },
      { number: 9166, name: "TecRobot" },
      { number: 9169, name: "AGROTECH" },
      { number: 9175, name: "BrainMachine-FRC" },

      { number: 9195, name: "Prodixu" },
      { number: 9199, name: "SESI SENAI SHARKS" },
      { number: 9200, name: "SESI SENAI STARDUST" },
      { number: 9219, name: "Nine Tails" },
      { number: 9302, name: "PARATECH FRC" },
      { number: 9305, name: "MonT" },

      { number: 9458, name: "SESI SENAI JACTECH" },
      { number: 9459, name: "SESI SENAI RPRT HAWKS" },
      { number: 9460, name: "SESI SENAI STEEL BULLS" },
      { number: 9484, name: "Robot’s District" },
      { number: 9485, name: "HYOBOTS" },
      { number: 9486, name: "ALPHASTORM FRC" },

      { number: 9611, name: "SESI SENAI SC CyberRain" },
      { number: 9614, name: "ROBOSSAUROS" },
      { number: 9617, name: "Metal Knight" },
      { number: 10263, name: "Temari Robotics" },

      { number: 10291, name: "MUTUM-X" },
      { number: 10295, name: "FOREST GUARDIANS" },
      { number: 10297, name: "PANTANALBOTS" },
      { number: 10345, name: "Sirius" },
      { number: 10356, name: "Capitech" },
      { number: 10917, name: "M.A.P.L.E." },
      { number: 11094, name: "SEASIDE Robotics" },
      { number: 11105, name: "GC 4 Tomorrow" },
    ],
    [],
  );

  const initialState = useMemo(
    () => ({
      matchNumber: "",
      teamNumber: "", // será preenchido ao selecionar
      teamName: "",
      teamQuery: "", // texto de busca
      startPos: "", // "left" | "center" | "right"
      autoCycles: 0,
      teleopCycles: 0,
      avgCycleSec: "",
      robotBroke: false,
      autoWorked: false,
      endgame: "none",
      autoClimb: "none",
      notes: "",
      createdAt: new Date().toISOString(),
    }),
    [],
  );

  const [form, setForm] = useState(initialState);
  const [openTeams, setOpenTeams] = useState(false);

  const dropdownRef = useRef(null);

  const setField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const clampInt = (v) => {
    const n = Number.parseInt(v, 10);
    return Number.isFinite(n) ? n : 0;
  };

  const inc = (key) => setForm((p) => ({ ...p, [key]: p[key] + 1 }));
  const dec = (key) =>
    setForm((p) => ({ ...p, [key]: Math.max(0, p[key] - 1) }));

  const isSelectedBtn = (current, value) =>
    current === value ? "bg-[#F1F5F9]" : "bg-[#ffffff]";

  const onlyDigits = (s) => s.replace(/\D/g, "");
  const onlyDecimal = (s) =>
    s
      .replace(",", ".")
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1");

  const clearForm = () => {
    setForm({ ...initialState, createdAt: new Date().toISOString() });
    setOpenTeams(false);
  };

  const filteredTeams = useMemo(() => {
    const q = form.teamQuery.trim().toLowerCase();
    if (!q) return TEAMS;

    return TEAMS.filter((t) => {
      const byNum = String(t.number).includes(q);
      const byName = t.name.toLowerCase().includes(q);
      return byNum || byName;
    });
  }, [TEAMS, form.teamQuery]);

  const selectTeam = (t) => {
    setForm((p) => ({
      ...p,
      teamNumber: String(t.number),
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

  const saveRecord = () => {
    const match = clampInt(form.matchNumber);
    const team = clampInt(form.teamNumber);

    if (!match) {
      alert("Preencha Nº da Partida.");
      return;
    }
    if (!team) {
      alert("Selecione a equipe (pesquise e clique na lista).");
      return;
    }
    if (!form.startPos) {
      alert("Selecione a Posição Inicial.");
      return;
    }

    const record = {
      ...form,
      matchNumber: match,
      teamNumber: team,
      createdAt: new Date().toISOString(),
      id: crypto?.randomUUID?.() ?? String(Date.now()),
    };

    const key = "scout_records";
    const current = JSON.parse(localStorage.getItem(key) || "[]");
    current.push(record);
    localStorage.setItem(key, JSON.stringify(current));

    alert("Scout salvo com sucesso!");
    clearForm(); // ✅ limpa automaticamente
  };

  return (
    <div className="w-[40vw] bg-[#ffffff] flex flex-col text-[#000000] p-6 mt-5 mb-5 rounded-[20px] border-2 border-[#E7E7E9]">
      <h1 className="font-bold text-2xl justify-start mb-4">Novo Scout</h1>

      {/* Team and Match Number */}
      <div className="flex flex-row justify-between gap-5 mb-4">
        {/* Match */}
        <div className="w-[50%]">
          <h1 className="mb-3.5 font-semibold">Nº da Partida:</h1>
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

        {/* Team (busca + dropdown) */}
        <div className="w-[50%]" ref={dropdownRef}>
          <h1 className="mb-3.5 font-semibold">Equipe (pesquise):</h1>

          <input
            type="text"
            placeholder="Ex: 8882, Hydra, SESI..."
            className="w-full px-4 py-2 rounded-lg border-2 border-[#E7E7E9]"
            value={form.teamQuery}
            onChange={(e) => {
              setField("teamQuery", e.target.value);
              setField("teamNumber", "");
              setField("teamName", "");
              setOpenTeams(true);
            }}
            onFocus={() => setOpenTeams(true)}
          />

          {openTeams && (
            <div className="mt-2 w-full max-h-56 overflow-auto rounded-lg border-2 border-[#E7E7E9] bg-white">
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

          {/* opcional: mostra selecionado */}
          {form.teamNumber && (
            <p className="mt-2 text-sm text-[#2e2e2e]">
              Selecionado: {form.teamName} #{form.teamNumber}
            </p>
          )}
        </div>
      </div>

      {/* Initial Position */}
      <div className="mb-4">
        <h1 className="mb-3.5 font-semibold">Posição Inicial:</h1>
        <div className="w-full flex flex-row justify-between gap-2 hover:cursor-pointer">
          <button
            type="button"
            onClick={() => setField("startPos", "left")}
            className={`py-2 w-[33.33%] flex justify-center rounded-lg hover:bg-[#F1F5F9] ${isSelectedBtn(
              form.startPos,
              "left",
            )}`}
          >
            Esquerda
          </button>
          <button
            type="button"
            onClick={() => setField("startPos", "center")}
            className={`py-2 w-[33.33%] flex justify-center rounded-lg hover:bg-[#F1F5F9] ${isSelectedBtn(
              form.startPos,
              "center",
            )}`}
          >
            Centro
          </button>
          <button
            type="button"
            onClick={() => setField("startPos", "right")}
            className={`py-2 w-[33.33%] flex justify-center rounded-lg hover:bg-[#F1F5F9] ${isSelectedBtn(
              form.startPos,
              "right",
            )}`}
          >
            Direita
          </button>
        </div>
      </div>

      {/* Cycles Counter */}
      <div className="mb-4 flex flex-row justify-between gap-5">
        <div className="w-[50%]">
          <h1 className="font-semibold mb-4">Ciclos Completados Auto:</h1>
          <div className="w-full flex flex-row gap-5">
            <button
              type="button"
              onClick={() => dec("autoCycles")}
              className="text-xl w-15 h-15 cursor-pointer border-2 border-[#E7E7E9] rounded-lg hover:bg-[#F1F5F9] font-bold"
            >
              -
            </button>
            <h1 className="text-6xl flex justify-center items-center">
              {form.autoCycles}
            </h1>
            <button
              type="button"
              onClick={() => inc("autoCycles")}
              className="text-3xl w-15 h-15 cursor-pointer border-2 border-[#E7E7E9] rounded-lg hover:bg-[#F1F5F9] font-bold"
            >
              +
            </button>
          </div>
        </div>

        <div className="w-[50%]">
          <h1 className="font-semibold mb-4">Ciclos Completados Teleop:</h1>
          <div className="w-full flex flex-row gap-5">
            <button
              type="button"
              onClick={() => dec("teleopCycles")}
              className="text-xl w-15 h-15 cursor-pointer border-2 border-[#E7E7E9] rounded-lg hover:bg-[#F1F5F9] font-bold"
            >
              -
            </button>
            <h1 className="text-6xl flex justify-center items-center">
              {form.teleopCycles}
            </h1>
            <button
              type="button"
              onClick={() => inc("teleopCycles")}
              className="text-3xl w-15 h-15 cursor-pointer border-2 border-[#E7E7E9] rounded-lg hover:bg-[#F1F5F9] font-bold"
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
            checked={form.robotBroke}
            onChange={(e) => setField("robotBroke", e.target.checked)}
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
            checked={form.autoWorked}
            onChange={(e) => setField("autoWorked", e.target.checked)}
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
          Autonomo funcionou como deveria
        </h1>
      </div>

      {/* Endgame */}
      <div className="mb-4">
        <h1 className="mb-3.5 font-semibold">Endgame:</h1>
        <div className="w-[65%] flex flex-row justify-between gap-2 hover:cursor-pointer">
          {[
            ["none", "Nenhum"],
            ["l1", "Nivel 1"],
            ["l2", "Nivel 2"],
            ["l3", "Nivel 3"],
          ].map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setField("endgame", val)}
              className={`py-2 w-[25%] flex justify-center rounded-lg hover:bg-[#F1F5F9] ${isSelectedBtn(
                form.endgame,
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
        <h1 className="mb-3.5 font-semibold">Escalado no Auto:</h1>
        <div className="w-[65%] flex flex-row justify-between gap-2 hover:cursor-pointer">
          {[
            ["none", "Nenhum"],
            ["l1", "Nivel 1"],
            ["l2", "Nivel 2"],
            ["l3", "Nivel 3"],
          ].map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setField("autoClimb", val)}
              className={`py-2 w-[25%] flex justify-center rounded-lg hover:bg-[#F1F5F9] ${isSelectedBtn(
                form.autoClimb,
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
          <h1 className="mb-3.5 font-semibold">Observações:</h1>
          <input
            type="text"
            placeholder="Ex: Robô tem a estratégia x somando com sua base torna fácil y coisas"
            className="w-full px-4 py-2 rounded-lg border-2 border-[#E7E7E9]"
            value={form.notes}
            onChange={(e) => setField("notes", e.target.value)}
          />
        </div>
      </div>

      {/* Save / Clear */}
      <div className="w-full flex justify-between items-center gap-2">
        <button
          type="button"
          onClick={saveRecord}
          className="w-[50%] flex justify-center bg-[#0F172A] text-white rounded-lg py-2 cursor-pointer hover:bg-[#141e37] transition-all duration-200"
        >
          Salvar
        </button>

        <button className="w-[50%] flex justify-center bg-[#ffffff] text-black rounded-lg py-2 cursor-pointer hover:bg-[#0F172A] hover:text-white transition-all duration-200">
          Limpar
        </button>
      </div>
    </div>
  );
}

export default ScoutMForm;
