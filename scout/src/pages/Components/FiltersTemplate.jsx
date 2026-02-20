import { useEffect, useMemo, useRef, useState } from "react";
import { TEAMS } from "../../data/Teams.js";
import pesquisar from "../../assets/icons8-pesquisar.png";

function FiltersTemplate({ filters, setFilters }) {
  const setField = (key, value) => setFilters((p) => ({ ...p, [key]: value }));
  const onlyDigits = (s) => s.replace(/\D/g, "");

  const [openTeams, setOpenTeams] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0); // <- item "selecionável" no teclado
  const dropdownRef = useRef(null);

  const filteredTeams = useMemo(() => {
    const qRaw = (filters?.team || "").trim().toLowerCase();
    if (!qRaw) return TEAMS;

    const qDigits = qRaw.replace(/\D/g, "");

    return TEAMS.filter((t) => {
      const byNum = qDigits && String(t.number).includes(qDigits);
      const byName = t.name.toLowerCase().includes(qRaw);
      return byNum || byName;
    });
  }, [filters?.team]);

  const selectTeam = (t) => {
    setField("team", String(t.number)); // salva só o número
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

  // sempre que a lista muda ou abre, reseta o "ativo" pro primeiro item
  useEffect(() => {
    if (openTeams) setActiveIndex(0);
  }, [openTeams, filters?.team]);

  const onTeamKeyDown = (e) => {
    if (!openTeams && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpenTeams(true);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filteredTeams.length - 1));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const pick = filteredTeams[activeIndex] || filteredTeams[0];
      if (pick) selectTeam(pick); // <- Enter pega o item e salva só o número
    }

    if (e.key === "Escape") {
      setOpenTeams(false);
    }
  };

  return (
    <div
      className="
      w-full
      max-w-130 sm:max-w-160 md:max-w-205 lg:max-w-245
      bg-white flex flex-col text-black
      p-4 sm:p-5 md:p-6
      mt-4 sm:mt-5
      rounded-2xl sm:rounded-[18px] md:rounded-[20px]
      border-2 border-[#E7E7E9]
    "
    >
      <div className="flex items-center gap-3 mb-4">
        <img
          src={pesquisar}
          className="w-6 h-6"
          alt=""
        />
        <h1 className="text-xl sm:text-2xl font-bold">Filtros</h1>
      </div>

      <div className="w-full flex flex-col md:flex-row justify-between gap-3">
        {/* dropdown time (overlay) */}
        <div className="w-full relative" ref={dropdownRef}>
          <input
            type="text"
            placeholder="Filtrar por time (nome ou número)"
            className="w-full px-4 py-2 rounded-lg border-2 border-[#E7E7E9]"
            value={filters.team}
            onChange={(e) => {
              setField("team", e.target.value);
              setOpenTeams(true);
            }}
            onFocus={() => setOpenTeams(true)}
            onKeyDown={onTeamKeyDown}
          />

          {openTeams && (
            <div className="absolute left-0 top-full mt-2 w-full max-h-56 overflow-auto rounded-lg border-2 border-[#E7E7E9] bg-white z-50 shadow-lg">
              {filteredTeams.length === 0 ? (
                <div className="px-4 py-3 text-[#2e2e2e]">
                  Nenhuma equipe encontrada.
                </div>
              ) : (
                filteredTeams.map((t, idx) => (
                  <button
                    key={t.number}
                    type="button"
                    onClick={() => selectTeam(t)}
                    className={`w-full text-left px-4 py-2 transition-all duration-150 ${
                      idx === activeIndex
                        ? "bg-[#F1F5F9]"
                        : "hover:bg-[#F1F5F9]"
                    }`}
                  >
                    {t.name} <span className="text-[#2e2e2e]">#{t.number}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* partida */}
        <input
          type="text"
          placeholder="Filtrar por partida"
          className="w-full md:max-w-65 px-4 py-2 rounded-lg border-2 border-[#E7E7E9]"
          value={filters.match}
          inputMode="numeric"
          pattern="[0-9]*"
          onChange={(e) => setField("match", onlyDigits(e.target.value))}
        />
      </div>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={() => setFilters({ team: "", match: "" })}
          className="rounded-lg px-4 py-2 border-2 border-[#E7E7E9] hover:bg-[#F1F5F9] transition-all duration-200 cursor-pointer"
        >
          Limpar filtros
        </button>
      </div>
    </div>
  );
}

export default FiltersTemplate;
