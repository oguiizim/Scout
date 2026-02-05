function ScoutMForm() {
  return (
    <div className="w-[40vw] bg-[#ffffff] flex flex-col text-[#000000] p-6 mt-5 mb-5 rounded-[20px] border-2 border-[#E7E7E9]">
      {/* Title */}
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
          />
        </div>

        {/* Team */}
        <div className="w-[50%]">
          <h1 className="mb-3.5 font-semibold">Nº da Equipe:</h1>
          <input
            type="text"
            placeholder="Ex: 254"
            className="w-full px-4 py-2 rounded-lg border-2 border-[#E7E7E9]"
          />
        </div>
      </div>

      {/* Initial Position */}
      <div className="mb-4">
        <h1 className="mb-3.5 font-semibold">Posição Inicial:</h1>
        <div className="w-full  flex flex-row justify-between gap-2 hover:cursor-pointer">
          <button
            type="button"
            className="py-2 w-[33.33%] bg-[#ffffff] flex justify-center rounded-lg hover:bg-[#F1F5F9]"
          >
            Esquerda
          </button>
          <button
            type="button"
            className="py-2 w-[33.33%] bg-[#ffffff] flex justify-center rounded-lg hover:bg-[#F1F5F9]"
          >
            Centro
          </button>
          <button
            type="button"
            className="py-2 w-[33.33%] bg-[#ffffff] flex justify-center rounded-lg hover:bg-[#F1F5F9]"
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
              className="text-xl w-15 h-15 cursor-pointer border-2 border-[#E7E7E9] rounded-lg hover:bg-[#F1F5F9] font-bold"
            >
              -
            </button>
            <h1 className="text-6xl flex justify-center items-center">0</h1>
            <button
              type="button"
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
              className="text-xl w-15 h-15 cursor-pointer border-2 border-[#E7E7E9] rounded-lg hover:bg-[#F1F5F9] font-bold"
            >
              -
            </button>
            <h1 className="text-6xl flex justify-center items-center">0</h1>
            <button
              type="button"
              className="text-3xl w-15 h-15 cursor-pointer border-2 border-[#E7E7E9] rounded-lg hover:bg-[#F1F5F9] font-bold"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Average Seconds Per Cycle */}
      <div className="mb-4">
        <h1 className="font-semibold mb-4">
          Tempo Médio por Ciclo (segundos):
        </h1>
        <input
          type="text"
          placeholder="Ex: 8.72s"
          className="w-full px-4 py-2 rounded-lg border-2 border-[#E7E7E9]"
        />
      </div>

      {/* Robot break on field? */}
      <div className="flex items-center mb-4">
        {/* Checkbox */}
        <label className="mr-2.5 cursor-pointer select-none">
          <input type="checkbox" className="peer hidden" />
          <span
            className="
              w-5 h-5
              rounded-md
              border border-[#343434]
              flex items-center justify-center
              transition
              peer-checked:bg-[#dbe9f6]
              peer-checked:border-[#dbe9f6]
            "
          ></span>
        </label>
        <h1 className="font-semibold items-center">
          Robô quebrou durante a partida
        </h1>
      </div>
      <div className="flex items-center mb-4">
        {/* Checkbox */}
        <label className="mr-2.5 cursor-pointer select-none">
          <input type="checkbox" className="peer hidden" />
          <span
            className="
              w-5 h-5
              rounded-md
              border border-[#343434]
              flex items-center justify-center
              transition
              peer-checked:bg-[#dbe9f6]
              peer-checked:border-[#dbe9f6]
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
        <div className="w-[65%]  flex flex-row justify-between gap-2 hover:cursor-pointer">
          <button
            type="button"
            className="py-2 w-[25%] bg-[#ffffff] flex justify-center rounded-lg hover:bg-[#F1F5F9]"
          >
            Nenhum
          </button>
          <button
            type="button"
            className="py-2 w-[25%] bg-[#ffffff] flex justify-center rounded-lg hover:bg-[#F1F5F9]"
          >
            Nivel 1
          </button>
          <button
            type="button"
            className="py-2 w-[25%] bg-[#ffffff] flex justify-center rounded-lg hover:bg-[#F1F5F9]"
          >
            Nivel 2
          </button>
          <button
            type="button"
            className="py-2 w-[25%] bg-[#ffffff] flex justify-center rounded-lg hover:bg-[#F1F5F9]"
          >
            Nivel 3
          </button>
        </div>
      </div>

      {/* Climbing on Auto */}
      <div className="mb-4">
        <h1 className="mb-3.5 font-semibold">Escalado no Auto:</h1>
        <div className="w-[65%]  flex flex-row justify-between gap-2 hover:cursor-pointer">
          <button
            type="button"
            className="py-2 w-[25%] bg-[#ffffff] flex justify-center rounded-lg hover:bg-[#F1F5F9]"
          >
            Nenhum
          </button>
          <button
            type="button"
            className="py-2 w-[25%] bg-[#ffffff] flex justify-center rounded-lg hover:bg-[#F1F5F9]"
          >
            Nivel 1
          </button>
          <button
            type="button"
            className="py-2 w-[25%] bg-[#ffffff] flex justify-center rounded-lg hover:bg-[#F1F5F9]"
          >
            Nivel 2
          </button>
          <button
            type="button"
            className="py-2 w-[25%] bg-[#ffffff] flex justify-center rounded-lg hover:bg-[#F1F5F9]"
          >
            Nivel 3
          </button>
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
          />
        </div>
      </div>

      {/* Save data */}
      <div className="flex flex-row justify-between gap-2">
        <button className="w-[50%] flex justify-center bg-[#0F172A] text-white rounded-lg py-2 cursor-pointer hover:bg-[#141e37] transition-all duration-200">
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
