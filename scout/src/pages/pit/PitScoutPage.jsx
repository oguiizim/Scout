import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import back from "../../assets/icons8-voltar.png";

import { TEAMS } from "../../data/Teams.js";
import { fetchMyTeamPitScout } from "../../api/services/dashboard.js";
import { updatePit, submitPitData } from "../../api/services/getPit.js";

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

function Label({ children }) {
  return <p className="text-sm font-semibold text-black/70 mb-1">{children}</p>;
}

export default function PitScoutPage() {
  const navigate = useNavigate();
  const { teamNumber } = useParams();

  const [loading, setLoading] = useState(true);
  const [pit, setPit] = useState(null);

  // ✅ modal de edição
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    team: "",
    robotName: "",
    driveTrain: "",
    shooter: "",
    intake: "",
    trenchOrBump: "",
    tower: "none",
    storage: "",
    autoLeft: "",
    autoCenter: "",
    autoRight: "",
    timeCycles: "",
    cycles: "",
    notes: "",
  });

  const teamInfo = useMemo(() => {
    const t = TEAMS.find((x) => String(x.number) === String(teamNumber));
    return t ? `${t.name} #${t.number}` : `Time #${teamNumber}`;
  }, [teamNumber]);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // Carregar pit
  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        const data = await fetchMyTeamPitScout(teamNumber);
        if (!alive) return;
        setPit(data);
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

  // ✅ sempre que abrir o modal, preenche com o pit atual (ou vazio se não existir)
  useEffect(() => {
    if (!editOpen) return;

    const base = pit ?? {};
    setForm({
      team: base.team ?? teamNumber ?? "",
      robotName: base.robotName ?? "",
      driveTrain: base.driveTrain ?? "",
      shooter: base.shooter ?? "",
      intake: base.intake ?? "",
      trenchOrBump: base.trenchOrBump ?? "",
      tower: base.tower ?? "none",
      storage: base.storage ?? "",
      autoLeft: base.autoLeft ?? "",
      autoCenter: base.autoCenter ?? "",
      autoRight: base.autoRight ?? "",
      timeCycles: base.timeCycles ?? "",
      cycles: base.cycles ?? "",
      notes: base.notes ?? "",
    });
  }, [editOpen, pit, teamNumber]);

  function toNumOrNull(v) {
    const s = String(v ?? "").trim();
    if (s === "") return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }

  async function handleSave() {
    try {
      setSaving(true);

      const payload = {
        team: Number(teamNumber),
        robotName: String(form.robotName ?? "").trim(),
        driveTrain: form.driveTrain || null,
        shooter: form.shooter || null,
        intake: form.intake || null,
        trenchOrBump: form.trenchOrBump || null,
        tower: form.tower || "none",
        storage: toNumOrNull(form.storage),
        autoLeft: toNumOrNull(form.autoLeft),
        autoCenter: toNumOrNull(form.autoCenter),
        autoRight: toNumOrNull(form.autoRight),
        timeCycles: toNumOrNull(form.timeCycles),
        cycles: toNumOrNull(form.cycles),
        notes: String(form.notes ?? "").trim(),
      };

      const saved = pit
        ? await updatePit(teamNumber, payload)
        : await submitPitData(payload);

      setPit(saved ?? payload);
      toast.success("Pit Scouting atualizado!");
      setEditOpen(false);
    } catch (e) {
      console.log("STATUS:", e?.response?.status);
      console.log("DATA:", e?.response?.data); // 👈 aqui costuma vir a mensagem do Spring
      console.log("HEADERS:", e?.response?.headers);
      console.log("CONFIG URL:", e?.config?.url);
      console.log("REQUEST PAYLOAD:", e?.config?.data); // 👈 payload serializado
      toast.error("Não foi possível salvar as alterações.");
    } finally {
      setSaving(false);
    }
  }

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

  // Tela quando não existe pit
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

            {/* ✅ agora abre modal pra criar também */}
            <button
              onClick={() => setEditOpen(true)}
              className="px-4 py-2 rounded-lg bg-white border-[#E7E7E9] border-2 hover:bg-[#0F172A] hover:border-[#0F172A] hover:text-white cursor-pointer transition-all duration-150"
            >
              Fazer Pit Scouting
            </button>
          </div>

          {/* ✅ MODAL */}
          {editOpen && (
            <div
              className="
                fixed inset-0 bg-black/30 z-50
                flex items-start sm:items-center justify-center
                overflow-y-auto
                p-3 sm:p-6
              "
              onClick={() => !saving && setEditOpen(false)}
            >
              <div
                className="
                  w-full
                  max-w-140 md:max-w-205 lg:max-w-245
                  bg-white rounded-2xl md:rounded-[20px]
                  border-2 border-[#E7E7E9]
                  p-4 sm:p-5 md:p-6
                  max-h-[90vh]
                  overflow-y-auto
                "
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-black">
                      {teamInfo}
                    </h2>
                    <p className="text-[#2e2e2e]">
                      Preencha/edite os dados do Pit.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => !saving && setEditOpen(false)}
                    className="text-black rounded-lg px-4 py-2 border-2 border-[#E7E7E9] hover:bg-[#F1F5F9] transition-all duration-200"
                    disabled={saving}
                  >
                    Fechar
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-[#2e2e2e]">
                  <div>
                    <Label>Nº do Time</Label>
                    <input
                      value={teamNumber}
                      disabled
                      className="w-full rounded-xl border-2 border-[#E7E7E9] p-3 bg-[#F8FAFC]"
                    />
                  </div>

                  <div>
                    <Label>Nome do robô</Label>
                    <input
                      value={form.robotName}
                      onChange={(e) => setField("robotName", e.target.value)}
                      className="w-full rounded-xl border-2 border-[#E7E7E9] p-3"
                      placeholder="Ex: NECTAR"
                    />
                  </div>

                  <div>
                    <Label>Drive Train</Label>
                    <select
                      value={form.driveTrain}
                      onChange={(e) => setField("driveTrain", e.target.value)}
                      className="w-full rounded-xl border-2 border-[#E7E7E9] p-3"
                    >
                      <option value="">—</option>
                      <option value="swerve">Swerve Drive</option>
                      <option value="tank">Tank Drive</option>
                    </select>
                  </div>

                  <div>
                    <Label>Shooter</Label>
                    <select
                      value={form.shooter}
                      onChange={(e) => setField("shooter", e.target.value)}
                      className="w-full rounded-xl border-2 border-[#E7E7E9] p-3"
                    >
                      <option value="">—</option>
                      <option value="turret">Torreta</option>
                      <option value="pivot">Pivot</option>
                      <option value="fixed">Fixo</option>
                      <option value="other">Outro</option>
                    </select>
                  </div>

                  <div>
                    <Label>Intake</Label>
                    <select
                      value={form.intake}
                      onChange={(e) => setField("intake", e.target.value)}
                      className="w-full rounded-xl border-2 border-[#E7E7E9] p-3"
                    >
                      <option value="">—</option>
                      <option value="4bar">4 Bar / Linkage</option>
                      <option value="pivot">Pivot</option>
                      <option value="inside_bumper">Dentro do Bumper</option>
                      <option value="other">Outro</option>
                    </select>
                  </div>

                  <div>
                    <Label>Trincheira ou Bump</Label>
                    <select
                      value={form.trenchOrBump}
                      onChange={(e) => setField("trenchOrBump", e.target.value)}
                      className="w-full rounded-xl border-2 border-[#E7E7E9] p-3"
                    >
                      <option value="">—</option>
                      <option value="trench">Trincheira</option>
                      <option value="bump">Bump</option>
                      <option value="both">Ambos</option>
                    </select>
                  </div>

                  <div>
                    <Label>Nível de Escalada</Label>
                    <select
                      value={form.tower}
                      onChange={(e) => setField("tower", e.target.value)}
                      className="w-full rounded-xl border-2 border-[#E7E7E9] p-3"
                    >
                      <option value="none">Nenhum</option>
                      <option value="l1">L1</option>
                      <option value="l2">L2</option>
                      <option value="l3">L3</option>
                    </select>
                  </div>

                  <div>
                    <Label>Capacidade de Armazenamento</Label>
                    <input
                      value={form.storage}
                      onChange={(e) => setField("storage", e.target.value)}
                      className="w-full rounded-xl border-2 border-[#E7E7E9] p-3"
                      placeholder="Ex: 8"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <p className="font-semibold text-black">
                      Quantidade de Auto rotas por posição
                    </p>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label>Esquerda</Label>
                        <input
                          value={form.autoLeft}
                          onChange={(e) => setField("autoLeft", e.target.value)}
                          className="w-full rounded-xl border-2 border-[#E7E7E9] p-3"
                          placeholder="Ex: 2"
                        />
                      </div>

                      <div>
                        <Label>Centro</Label>
                        <input
                          value={form.autoCenter}
                          onChange={(e) =>
                            setField("autoCenter", e.target.value)
                          }
                          className="w-full rounded-xl border-2 border-[#E7E7E9] p-3"
                          placeholder="Ex: 1"
                        />
                      </div>

                      <div>
                        <Label>Direita</Label>
                        <input
                          value={form.autoRight}
                          onChange={(e) =>
                            setField("autoRight", e.target.value)
                          }
                          className="w-full rounded-xl border-2 border-[#E7E7E9] p-3"
                          placeholder="Ex: 0"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Tempo médio p/Ciclo</Label>
                    <input
                      value={form.timeCycles}
                      onChange={(e) => setField("timeCycles", e.target.value)}
                      className="w-full rounded-xl border-2 border-[#E7E7E9] p-3"
                      placeholder="Ex: 3.2"
                    />
                  </div>

                  <div>
                    <Label>Quantidade de ciclos p/Break</Label>
                    <input
                      value={form.cycles}
                      onChange={(e) => setField("cycles", e.target.value)}
                      className="w-full rounded-xl border-2 border-[#E7E7E9] p-3"
                      placeholder="Ex: 12"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label>Observações</Label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => setField("notes", e.target.value)}
                      className="w-full min-h-[120px] rounded-xl border-2 border-[#E7E7E9] p-3"
                      placeholder="Detalhes importantes..."
                    />
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => !saving && setEditOpen(false)}
                    className="text-black rounded-lg px-4 py-2 border-2 border-[#E7E7E9] hover:bg-[#F1F5F9] transition-all duration-200"
                    disabled={saving}
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    className="rounded-lg px-6 py-2 bg-[#0F172A] text-white hover:bg-[#141e37] transition-all duration-200 disabled:opacity-60"
                    disabled={saving}
                  >
                    {saving ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              </div>
            </div>
          )}
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

            {/* ✅ agora abre modal */}
            <button
              onClick={() => setEditOpen(true)}
              className="px-4 py-2 rounded-lg bg-white border-[#E7E7E9] border-2 hover:bg-[#0F172A] hover:border-[#0F172A] hover:text-white cursor-pointer transition-all duration-150"
            >
              Editar Pit
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

        {/* ✅ MODAL EDIT */}
        {editOpen && (
          <div
            className="
              fixed inset-0 bg-black/30 z-50
              flex items-start sm:items-center justify-center
              overflow-y-auto
              p-3 sm:p-6
            "
            onClick={() => !saving && setEditOpen(false)}
          >
            <div
              className="
                w-full
                max-w-140 md:max-w-205 lg:max-w-245
                bg-white rounded-2xl md:rounded-[20px]
                border-2 border-[#E7E7E9]
                p-4 sm:p-5 md:p-6
                max-h-[90vh]
                overflow-y-auto
              "
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-black">
                    {teamInfo}
                  </h2>
                  <p className="text-[#2e2e2e]">
                    Edite e salve — isso vai atualizar o registro do Pit.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => !saving && setEditOpen(false)}
                  className="text-black rounded-lg px-4 py-2 border-2 border-[#E7E7E9] hover:bg-[#F1F5F9] transition-all duration-200"
                  disabled={saving}
                >
                  Fechar
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-[#2e2e2e]">
                <div>
                  <Label>Nº do Time</Label>
                  <input
                    value={teamNumber}
                    disabled
                    className="w-full rounded-xl border-2 border-[#E7E7E9] p-3 bg-[#F8FAFC]"
                  />
                </div>

                <div>
                  <Label>Nome do robô</Label>
                  <input
                    value={form.robotName}
                    onChange={(e) => setField("robotName", e.target.value)}
                    className="w-full rounded-xl border-2 border-[#E7E7E9] p-3"
                    placeholder="Ex: NECTAR"
                  />
                </div>

                <div>
                  <Label>Drive Train</Label>
                  <select
                    value={form.driveTrain}
                    onChange={(e) => setField("driveTrain", e.target.value)}
                    className="w-full rounded-xl border-2 border-[#E7E7E9] p-3"
                  >
                    <option value="">—</option>
                    <option value="swerve">Swerve Drive</option>
                    <option value="tank">Tank Drive</option>
                  </select>
                </div>

                <div>
                  <Label>Shooter</Label>
                  <select
                    value={form.shooter}
                    onChange={(e) => setField("shooter", e.target.value)}
                    className="w-full rounded-xl border-2 border-[#E7E7E9] p-3"
                  >
                    <option value="">—</option>
                    <option value="turret">Torreta</option>
                    <option value="pivot">Pivot</option>
                    <option value="fixed">Fixo</option>
                    <option value="other">Outro</option>
                  </select>
                </div>

                <div>
                  <Label>Intake</Label>
                  <select
                    value={form.intake}
                    onChange={(e) => setField("intake", e.target.value)}
                    className="w-full rounded-xl border-2 border-[#E7E7E9] p-3"
                  >
                    <option value="">—</option>
                    <option value="4bar">4 Bar / Linkage</option>
                    <option value="pivot">Pivot</option>
                    <option value="inside_bumper">Dentro do Bumper</option>
                    <option value="other">Outro</option>
                  </select>
                </div>

                <div>
                  <Label>Trincheira ou Bump</Label>
                  <select
                    value={form.trenchOrBump}
                    onChange={(e) => setField("trenchOrBump", e.target.value)}
                    className="w-full rounded-xl border-2 border-[#E7E7E9] p-3"
                  >
                    <option value="">—</option>
                    <option value="trench">Trincheira</option>
                    <option value="bump">Bump</option>
                    <option value="both">Ambos</option>
                  </select>
                </div>

                <div>
                  <Label>Nível de Escalada</Label>
                  <select
                    value={form.tower}
                    onChange={(e) => setField("tower", e.target.value)}
                    className="w-full rounded-xl border-2 border-[#E7E7E9] p-3"
                  >
                    <option value="none">Nenhum</option>
                    <option value="l1">L1</option>
                    <option value="l2">L2</option>
                    <option value="l3">L3</option>
                  </select>
                </div>

                <div>
                  <Label>Capacidade de Armazenamento</Label>
                  <input
                    value={form.storage}
                    onChange={(e) => setField("storage", e.target.value)}
                    className="w-full rounded-xl border-2 border-[#E7E7E9] p-3"
                    placeholder="Ex: 8"
                  />
                </div>

                <div className="md:col-span-2">
                  <p className="font-semibold text-black">
                    Quantidade de Auto rotas por posição
                  </p>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label>Esquerda</Label>
                      <input
                        value={form.autoLeft}
                        onChange={(e) => setField("autoLeft", e.target.value)}
                        className="w-full rounded-xl border-2 border-[#E7E7E9] p-3"
                        placeholder="Ex: 2"
                      />
                    </div>

                    <div>
                      <Label>Centro</Label>
                      <input
                        value={form.autoCenter}
                        onChange={(e) => setField("autoCenter", e.target.value)}
                        className="w-full rounded-xl border-2 border-[#E7E7E9] p-3"
                        placeholder="Ex: 1"
                      />
                    </div>

                    <div>
                      <Label>Direita</Label>
                      <input
                        value={form.autoRight}
                        onChange={(e) => setField("autoRight", e.target.value)}
                        className="w-full rounded-xl border-2 border-[#E7E7E9] p-3"
                        placeholder="Ex: 0"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Tempo médio p/Ciclo</Label>
                  <input
                    value={form.timeCycles}
                    onChange={(e) => setField("timeCycles", e.target.value)}
                    className="w-full rounded-xl border-2 border-[#E7E7E9] p-3"
                    placeholder="Ex: 3.2"
                  />
                </div>

                <div>
                  <Label>Quantidade de ciclos p/Break</Label>
                  <input
                    value={form.cycles}
                    onChange={(e) => setField("cycles", e.target.value)}
                    className="w-full rounded-xl border-2 border-[#E7E7E9] p-3"
                    placeholder="Ex: 12"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Observações</Label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setField("notes", e.target.value)}
                    className="w-full min-h-[120px] rounded-xl border-2 border-[#E7E7E9] p-3"
                    placeholder="Detalhes importantes..."
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={() => !saving && setEditOpen(false)}
                  className="text-black rounded-lg px-4 py-2 border-2 border-[#E7E7E9] hover:bg-[#F1F5F9] transition-all duration-200"
                  disabled={saving}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-lg px-6 py-2 bg-[#0F172A] text-white hover:bg-[#141e37] transition-all duration-200 disabled:opacity-60"
                  disabled={saving}
                >
                  {saving ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
