import { useMemo } from "react";

function FiltersTemplate({ filters, setFilters }) {
  const setField = (key, value) =>
    setFilters((p) => ({ ...p, [key]: value }));

  // só números para partida
  const onlyDigits = (s) => s.replace(/\D/g, "");

  return (
    <div className="w-[60vw] bg-[#ffffff] flex flex-col text-[#000000] p-6 mt-5 rounded-[20px] border-2 border-[#E7E7E9]">
      <div className="flex items-center gap-3 mb-4">
        <img src="/src/assets/icons8-pesquisar.png" className="w-6 h-6" alt="" />
        <h1 className="text-2xl font-bold">Filtros</h1>
      </div>

      <div className="w-full flex justify-between gap-3">
        <input
          type="text"
          placeholder="Filtrar por time"
          className="w-full px-4 py-2 rounded-lg border-2 border-[#E7E7E9]"
          value={filters.team}
          onChange={(e) => setField("team", e.target.value)}
        />

        <input
          type="text"
          placeholder="Filtrar por partida"
          className="w-full px-4 py-2 rounded-lg border-2 border-[#E7E7E9]"
          value={filters.match}
          inputMode="numeric"
          pattern="[0-9]*"
          onChange={(e) => setField("match", onlyDigits(e.target.value))}
        />
      </div>
    </div>
  );
}

export default FiltersTemplate;
