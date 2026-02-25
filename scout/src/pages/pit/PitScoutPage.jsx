import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ChevronLeft } from "lucide-react";

import { TEAMS } from "../../data/Teams.js";
import { fetchMyTeamPitScout } from "../../api/services/dashboard.js";
import {
  updatePit,
  submitPitData,
  deletePit,
} from "../../api/services/getPit.js";

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
    <div className="rounded-xl border-2 border-border bg-background/5 p-4">
      <p className="text-xl font-bold tracking-wide text-text/60">{label}</p>
      <p className="mt-2 text-medium font-normal text-text">
        {value !== undefined &&
        value !== null &&
        String(value).trim() !== "" ? (
          value
        ) : (
          <span className="text-text/50">—</span>
        )}
      </p>
    </div>
  );
}

function Label({ children }) {
  return <p className="text-sm font-semibold text-text/70 mb-1">{children}</p>;
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
        console.log(e);
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

  const deleteScout = async () => {
    const ok = window.confirm("Tem certeza que deseja excluir este scout?");
    if (!ok) return;

    try {
      await deletePit(Number(teamNumber)); // garante número

      toast.success("Scout excluído do banco!");
      setPit(null); // tela cai no "não existe pit"
      setEditOpen(false); // se estiver aberto
      // opcional: navegar pra lista anterior
      // navigate(-1);
    } catch (err) {
      console.log("delete error:", err?.response?.status, err?.response?.data);
      toast.error(err?.response?.data?.message ?? "Erro ao excluir scout.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-text p-6">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 px-4 py-2 rounded-lg bg-background border-border border-2 items-center flex cursor-pointer"
          >
            <ChevronLeft />
            <p className="text-xl">Voltar</p>
          </button>
          <p className="text-text/70">Carregando Pit Scouting…</p>
        </div>
      </div>
    );
  }

  // Tela quando não existe pit
  if (!pit) {
    return (
      <div className="min-h-screen bg-background text-text p-6">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 px-4 py-2 rounded-lg bg-background border-border border-2 items-center flex cursor-pointer hover:bg-lightblue transition-all duration-150"
          >
            <ChevronLeft />
            <p className="text-xl">Voltar</p>
          </button>

          <h1 className="text-2xl font-semibold">Pit Scouting</h1>
          <p className="mt-1 text-text/70">{teamInfo}</p>

          <p className="mt-6 text-text/70">
            Nenhum registro de Pit Scouting encontrado para este time.
          </p>

          <div className="mt-6 flex gap-2 flex-wrap">
            <button
              onClick={() => navigate(`/dashboard/${teamNumber}`)}
              className="px-4 py-2 rounded-lg bg-background border-border border-2 cursor-pointer hover:bg-lightblue transition-all duration-150"
            >
              Ir para Dashboard
            </button>

            {/* ✅ agora abre modal pra criar também */}
            <button
              onClick={() => navigate("/scout/p")}
              className="px-4 py-2 rounded-lg bg-background border-border border-2 hover:bg-lightblue hover:text-white cursor-pointer transition-all duration-150"
            >
              Fazer Pit Scouting
            </button>
          </div>
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
    <div className="min-h-screen bg-background text-text p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="mb-4 px-4 py-2 rounded-lg bg-background border-border border-2 items-center flex cursor-pointer hover:bg-lightblue transition-all duration-150"
            >
              <ChevronLeft />
              <p className="text-xl">Voltar</p>
            </button>

            <h1 className="text-3xl font-bold">Pit Scouting</h1>
            <p className="text-text/70 mt-1">{teamInfo}</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => deleteScout()}
              className="px-4 py-2 rounded-lg bg-background border-border border-2 hover:text-white hover:bg-lightblue cursor-pointer transition-all duration-150"
            >
              Excluir Pit
            </button>

            <button
              onClick={() => navigate(`/dashboard/${teamNumber}`)}
              className="px-4 py-2 rounded-lg bg-background border-border border-2 cursor-pointer hover:bg-lightblue transition-all duration-150"
            >
              Ir para Dashboard
            </button>

            {/* ✅ agora abre modal */}
            <button
              onClick={() => setEditOpen(true)}
              className="px-4 py-2 rounded-lg bg-background border-border border-2 hover:text-white hover:bg-lightblue cursor-pointer transition-all duration-150"
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
        <div className="mt-8 rounded-2xl border-2 border-border bg-background/5 p-5">
          <h2 className="text-xl font-bold tracking-wide text-text/60">
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
        <div className="mt-8 rounded-2xl border-2 border-border bg-background/5 p-5">
          <h2 className="text-lg font-semibold">Observações</h2>
          <p className="mt-3 text-text/80 whitespace-pre-wrap">
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
                bg-background rounded-2xl md:rounded-[20px]
                border-2 border-border
                p-4 sm:p-5 md:p-6
                max-h-[90vh]
                overflow-y-auto
              "
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-text">
                    {teamInfo}
                  </h2>
                  <p className="text-pitscout">
                    Edite e salve — isso vai atualizar o registro do Pit.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-scoutpit">
                <div>
                  <Label>Nº do Time</Label>
                  <input
                    value={teamNumber}
                    disabled
                    className="w-full rounded-xl border-2 border-border p-3"
                  />
                </div>

                <div>
                  <Label>Nome do robô</Label>
                  <input
                    value={form.robotName}
                    onChange={(e) => setField("robotName", e.target.value)}
                    className="w-full rounded-xl border-2 border-border p-3"
                    placeholder="Ex: NECTAR"
                  />
                </div>

                <div>
                  <Label>Drive Train</Label>
                  <select
                    value={form.driveTrain}
                    onChange={(e) => setField("driveTrain", e.target.value)}
                    className="w-full rounded-xl border-2 border-border p-3"
                  >
                    <option value="" className="bg-background">
                      —
                    </option>
                    <option value="swerve" className="bg-background">
                      Swerve Drive
                    </option>
                    <option value="tank" className="bg-background">
                      Tank Drive
                    </option>
                  </select>
                </div>

                <div>
                  <Label>Shooter</Label>
                  <select
                    value={form.shooter}
                    onChange={(e) => setField("shooter", e.target.value)}
                    className="w-full rounded-xl border-2 border-border p-3"
                  >
                    <option value="" className="bg-background">
                      —
                    </option>
                    <option value="turret" className="bg-background">
                      Torreta
                    </option>
                    <option value="pivot" className="bg-background">
                      Pivot
                    </option>
                    <option value="fixed" className="bg-background">
                      Fixo
                    </option>
                    <option value="other" className="bg-background">
                      Outro
                    </option>
                  </select>
                </div>

                <div>
                  <Label>Intake</Label>
                  <select
                    value={form.intake}
                    onChange={(e) => setField("intake", e.target.value)}
                    className="w-full rounded-xl border-2 border-border p-3"
                  >
                    <option value="" className="bg-background">
                      —
                    </option>
                    <option value="4bar" className="bg-background">
                      4 Bar / Linkage
                    </option>
                    <option value="pivot" className="bg-background">
                      Pivot
                    </option>
                    <option value="inside_bumper" className="bg-background">
                      Dentro do Bumper
                    </option>
                    <option value="other" className="bg-background">
                      Outro
                    </option>
                  </select>
                </div>

                <div>
                  <Label>Trincheira ou Bump</Label>
                  <select
                    value={form.trenchOrBump}
                    onChange={(e) => setField("trenchOrBump", e.target.value)}
                    className="w-full rounded-xl border-2 border-border p-3"
                  >
                    <option value="" className="bg-background">
                      —
                    </option>
                    <option value="trench" className="bg-background">
                      Trincheira
                    </option>
                    <option value="bump" className="bg-background">
                      Bump
                    </option>
                    <option value="both" className="bg-background">
                      Ambos
                    </option>
                  </select>
                </div>

                <div>
                  <Label>Nível de Escalada</Label>
                  <select
                    value={form.tower}
                    onChange={(e) => setField("tower", e.target.value)}
                    className="w-full rounded-xl border-2 border-border p-3"
                  >
                    <option value="none" className="bg-background">
                      Nenhum
                    </option>
                    <option value="l1" className="bg-background">
                      L1
                    </option>
                    <option value="l2" className="bg-background">
                      L2
                    </option>
                    <option value="l3" className="bg-background">
                      L3
                    </option>
                  </select>
                </div>

                <div>
                  <Label>Capacidade de Armazenamento</Label>
                  <input
                    value={form.storage}
                    onChange={(e) => setField("storage", e.target.value)}
                    className="w-full rounded-xl border-2 border-border p-3"
                    placeholder="Ex: 8"
                  />
                </div>

                <div className="md:col-span-2">
                  <p className="font-semibold text-text">
                    Quantidade de Auto rotas por posição
                  </p>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label>Esquerda</Label>
                      <input
                        value={form.autoLeft}
                        onChange={(e) => setField("autoLeft", e.target.value)}
                        className="w-full rounded-xl border-2 border-border p-3"
                        placeholder="Ex: 2"
                      />
                    </div>

                    <div>
                      <Label>Centro</Label>
                      <input
                        value={form.autoCenter}
                        onChange={(e) => setField("autoCenter", e.target.value)}
                        className="w-full rounded-xl border-2 border-border p-3"
                        placeholder="Ex: 1"
                      />
                    </div>

                    <div>
                      <Label>Direita</Label>
                      <input
                        value={form.autoRight}
                        onChange={(e) => setField("autoRight", e.target.value)}
                        className="w-full rounded-xl border-2 border-border p-3"
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
                    className="w-full rounded-xl border-2 border-border p-3"
                    placeholder="Ex: 3.2"
                  />
                </div>

                <div>
                  <Label>Quantidade de ciclos p/Break</Label>
                  <input
                    value={form.cycles}
                    onChange={(e) => setField("cycles", e.target.value)}
                    className="w-full rounded-xl border-2 border-border p-3"
                    placeholder="Ex: 12"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Observações</Label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setField("notes", e.target.value)}
                    className="w-full min-h-[120px] rounded-xl border-2 border-border p-3"
                    placeholder="Detalhes importantes..."
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={() => !saving && setEditOpen(false)}
                  className="text-text rounded-lg px-4 py-2 border-2 border-border hover:bg-lightblue transition-all duration-200"
                  disabled={saving}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-lg px-6 py-2 bg-darkblue text-white hover:bg-hoverblue transition-all duration-200 disabled:opacity-60"
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
