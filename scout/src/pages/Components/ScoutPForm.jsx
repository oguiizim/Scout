import { useState } from "react";

function ScoutPForm() {
  const [count, setCount] = useState(0);

  return (
    <div className="w-[40vw] bg-[#ffffff] flex flex-col text-[#000000] p-6 mt-5 mb-5 rounded-[20px] border-2 border-[#E7E7E9]">
      {/* Title */}
      <h1 className="font-bold text-2xl justify-start mb-4">Novo Scout</h1>

      {/* Team Number and Robot Name */}
      <div className="flex flex-row justify-between gap-2 mb-4">
        <div className="w-[50%] flex flex-col mb-3.5 font-semibold">
          <h1 className="mb-3.5">Nº do Time:</h1>
          <input
            type="text"
            placeholder="Ex: 254"
            className="w-full px-4 py-2 rounded-lg border-2 border-[#E7E7E9]"
          />
        </div>

        <div className="w-[50%] flex flex-col">
          <h1 className="mb-3.5 font-semibold">Nome do robô:</h1>
          <input
            type="text"
            placeholder="Ex: Doppler"
            className="w-full px-4 py-2 rounded-lg border-2 border-[#E7E7E9]"
          />
        </div>
      </div>

      {/* DriveBase */}
      <div className="flex flex-col mb-4">
        <h1 className="font-semibold mb-3.5">Tipo de Drive Train:</h1>
        <div className="flex flex-row justify-between gap-2">
          <button className="w-[50%] py-2 rounded-lg hover:bg-[#F1F5F9] transition-all duration-200 cursor-pointer">
            Swerve Drive
          </button>
          <button className="w-[50%] py-2 rounded-lg hover:bg-[#F1F5F9] transition-all duration-200 cursor-pointer">
            Tank Drive
          </button>
        </div>
      </div>

      {/* Tipo de Shooter */}
      <div className="flex flex-col mb-4">
        <h1 className="font-semibold mb-3.5">Tipo de Shooter:</h1>
        <div className="flex flex-row justify-between gap-2">
          <button className="w-[25%] py-2 rounded-lg hover:bg-[#F1F5F9] transition-all duration-200 cursor-pointer">
            Torreta
          </button>
          <button className="w-[25%] py-2 rounded-lg hover:bg-[#F1F5F9] transition-all duration-200 cursor-pointer">
            Pivot
          </button>
          <button className="w-[25%] py-2 rounded-lg hover:bg-[#F1F5F9] transition-all duration-200 cursor-pointer">
            Fixo
          </button>
          <button className="w-[25%] py-2 rounded-lg hover:bg-[#F1F5F9] transition-all duration-200 cursor-pointer">
            Outro
          </button>
        </div>
      </div>

      {/* Tipo de Intake */}
      <div className="flex flex-col mb-4">
        <h1 className="font-semibold mb-3.5">Tipo de Intake:</h1>
        <div className="flex flex-row justify-between gap-2">
          <button className="w-[25%] py-2 rounded-lg hover:bg-[#F1F5F9] transition-all duration-200 cursor-pointer">
            4 Bar / Linkage
          </button>
          <button className="w-[25%] py-2 rounded-lg hover:bg-[#F1F5F9] transition-all duration-200 cursor-pointer">
            Pivot
          </button>
          <button className="w-[25%] py-2 rounded-lg hover:bg-[#F1F5F9] transition-all duration-200 cursor-pointer">
            Dentro do Bumper
          </button>
          <button className="w-[25%] py-2 rounded-lg hover:bg-[#F1F5F9] transition-all duration-200 cursor-pointer">
            Outro
          </button>
        </div>
      </div>

      {/* Trincheira ou Bump */}
      <div className="flex flex-col mb-4">
        <h1 className="font-semibold mb-3.5">Trincheira ou Bump:</h1>
        <div className="flex flex-row justify-between gap-2">
          <button className="w-[33%] py-2 rounded-lg hover:bg-[#F1F5F9] transition-all duration-200 cursor-pointer">
            Trincheira
          </button>
          <button className="w-[33%] py-2 rounded-lg hover:bg-[#F1F5F9] transition-all duration-200 cursor-pointer">
            Bump
          </button>
          <button className="w-[33%] py-2 rounded-lg hover:bg-[#F1F5F9] transition-all duration-200 cursor-pointer">
            Ambos
          </button>
        </div>
      </div>

      {/* Rotas de Auto */}
      <div className="flex flex-col mb-4">
        <h1 className="font-semibold mb-3.5">
          Quantidade de Auto rotas por posição:
        </h1>
        <div className="flex flex-row gap-2">
          <input
            type="text"
            placeholder="Esquerda - Deposit"
            className="w-[33%] px-4 py-2 rounded-lg border-2 border-[#E7E7E9]"
          />
          <input
            type="text"
            placeholder="Centro"
            className="w-[33%] px-4 py-2 rounded-lg border-2 border-[#E7E7E9]"
          />
          <input
            type="text"
            placeholder="Direita - Source"
            className="w-[33%] px-4 py-2 rounded-lg border-2 border-[#E7E7E9]"
          />
        </div>
      </div>

      {/* Capacidade de Armazenamento */}
      <div className="flex flex-col mb-4">
        <h1 className="font-semibold mb-3.5">Capacidade de Armazenamento:</h1>
        <input
          type="text"
          placeholder="Ex: 26"
          className="w-[50%] px-4 py-2 rounded-lg border-2 border-[#E7E7E9]"
        />
      </div>

      {/* Nivel de Escalada */}
      <div className="flex flex-col mb-4">
        <h1 className="font-semibold mb-3.5">Nivel de Escalada:</h1>
        <div className="flex flex-row justify-between gap-2">
          <button className="w-[25%] py-2 rounded-lg hover:bg-[#F1F5F9] transition-all duration-200 cursor-pointer">
            Nenhum
          </button>
          <button className="w-[25%] py-2 rounded-lg hover:bg-[#F1F5F9] transition-all duration-200 cursor-pointer">
            L1
          </button>
          <button className="w-[25%] py-2 rounded-lg hover:bg-[#F1F5F9] transition-all duration-200 cursor-pointer">
            L2
          </button>
          <button className="w-[25%] py-2 rounded-lg hover:bg-[#F1F5F9] transition-all duration-200 cursor-pointer">
            L3
          </button>
        </div>
      </div>

      {/* Velocidade dos Ciclos */}
      <div className="flex flex-col mb-4">
        <h1 className="font-semibold mb-3.5">Tempo medio p/Ciclo:</h1>
        <input
          type="text"
          placeholder="Ex: 7.65s"
          className="w-[50%] px-4 py-2 rounded-lg border-2 border-[#E7E7E9]"
        />
      </div>

      {/* Quantidade de Ciclos por Timer */}
      <div className="flex flex-col mb-4">
        <h1 className="font-semibold mb-3.5">Quantidade de ciclos p/Break:</h1>
        <input
          type="text"
          placeholder="Ex: 2"
          className="w-[50%] px-4 py-2 rounded-lg border-2 border-[#E7E7E9]"
        />
      </div>

      {/* Obs */}
      <div className="flex flex-col mb-4">
        <h1 className="font-semibold mb-3.5">Observações:</h1>
        <input
          type="text"
          placeholder="Ex: Atiramos em qualquer local da arena"
          className="w-full px-4 py-2 rounded-lg border-2 border-[#E7E7E9]"
        />
      </div>

      {/* Save and Delete */}
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
export default ScoutPForm;