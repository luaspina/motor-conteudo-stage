import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Save } from "lucide-react";
import { ClientContextHeader, ClientSelector, EmptyState, Toast, MutationError } from "@/shared/components";
import { useClientParam, useToast } from "@/shared/hooks";
import { useDna } from "@/features/dna/hooks";
import {
  usePautas,
  useGeneratePautas,
  useSavePautasBatch,
  useUpdatePauta,
} from "../hooks";
import { PlanningForm, PautaCard, PautaToPostDialog } from "../components";
import type {
  Pauta,
  PautaStatus,
  GeneratedPauta,
  PlanejamentoFormValues,
} from "../types";

/** Draft pauta: in memory, not yet saved */
interface DraftPauta extends GeneratedPauta {
  localStatus: PautaStatus;
}

export function PlanejamentoPage() {
  const navigate = useNavigate();
  const { clientId, client } = useClientParam();
  const [draftPautas, setDraftPautas] = useState<DraftPauta[]>([]);
  const [sourceParams, setSourceParams] = useState<Record<string, unknown>>({});
  const [postingPauta, setPostingPauta] = useState<Pauta | null>(null);

  const { data: dna, isLoading: dnaLoading } = useDna(clientId || undefined);
  const { data: savedPautas, isLoading: pautasLoading } = usePautas(clientId || undefined);
  const generatePautas = useGeneratePautas();
  const saveBatch = useSavePautasBatch();
  const updatePauta = useUpdatePauta();
  const { toast, show: showToast } = useToast();
  const savedSectionRef = useRef<HTMLDivElement>(null);

  function handleClientChange(id: string) {
    if (draftPautas.length > 0) {
      const confirmed = window.confirm(
        "Você tem conteúdo gerado ainda não salvo. Se trocar de cliente, esse conteúdo será descartado. Deseja continuar?",
      );
      if (!confirmed) return;
    }
    setDraftPautas([]);
    generatePautas.reset();
    navigate(id ? `?clientId=${id}` : "", { replace: true });
  }

  function handleGenerate(values: PlanejamentoFormValues) {
    if (!client || !dna) return;

    setSourceParams(values);
    generatePautas.mutate(
      { client: client, dna, input: values },
      {
        onSuccess: (response) => {
          if (response.data) {
            setDraftPautas(
              response.data.map((p) => ({ ...p, localStatus: "idea" as PautaStatus })),
            );
          }
        },
      },
    );
  }

  function updateDraft(index: number, updates: Partial<DraftPauta>) {
    setDraftPautas((prev) => prev.map((p, i) => (i === index ? { ...p, ...updates } : p)));
  }

  function handleSaveBatch() {
    if (!clientId || draftPautas.length === 0) return;

    const batchId = crypto.randomUUID();
    const inserts = draftPautas.map((d) => ({
      client_id: clientId,
      batch_id: batchId,
      titulo: d.titulo,
      pilar: d.pilar || undefined,
      subpilar: d.subpilar || undefined,
      formato: d.formato_recomendado || undefined,
      objetivo: d.objetivo || undefined,
      resumo: d.resumo || undefined,
      justificativa: d.justificativa || undefined,
      prioridade: d.prioridade,
      status: d.localStatus,
      source_params: sourceParams,
    }));

    saveBatch.mutate(inserts, {
      onSuccess: () => {
        setDraftPautas([]);
        showToast("Lote salvo com sucesso");
        setTimeout(() => {
          savedSectionRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      },
    });
  }

  function handleUpdatePauta(id: string, data: { titulo?: string; resumo?: string; status?: PautaStatus }) {
    updatePauta.mutate({ id, clientId: clientId, data });
  }

  // Group saved pautas by batch
  const batches = groupByBatch(savedPautas ?? []);

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Planejamento</h1>

      {client && <ClientContextHeader client={client} clientId={clientId} />}

      {/* Client selector */}
      <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, padding: 20, marginBottom: 24 }}>
        <ClientSelector value={clientId} onChange={(id) => handleClientChange(id)} />
        {clientId && dnaLoading && (
          <p style={{ fontSize: 13, color: "#999", marginTop: 10 }}>Carregando DNA...</p>
        )}
        {clientId && !dnaLoading && !dna && (
          <p style={{ fontSize: 13, color: "#d32f2f", marginTop: 10 }}>
            Este cliente ainda não tem DNA cadastrado.
          </p>
        )}
      </div>

      {/* Planning form */}
      {clientId && dna && draftPautas.length === 0 && (
        <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Novo planejamento</h2>
          <PlanningForm onSubmit={handleGenerate} isGenerating={generatePautas.isPending} />
          <MutationError error={generatePautas.error} />
        </div>
      )}

      {/* Draft pautas */}
      {draftPautas.length > 0 && (
        <div style={{ background: "#fff", border: "2px solid #009B4D", borderRadius: 10, padding: 24, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
              Pautas geradas ({draftPautas.length})
            </h2>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => {
                  const confirmed = window.confirm(
                    "Deseja descartar este lote de pautas? Essa ação não poderá ser desfeita.",
                  );
                  if (confirmed) setDraftPautas([]);
                }}
                disabled={saveBatch.isPending}
                style={{
                  padding: "8px 16px",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: 13,
                  color: "#666",
                }}
              >
                Descartar
              </button>
              <button
                onClick={handleSaveBatch}
                disabled={saveBatch.isPending}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 20px",
                  border: "none",
                  borderRadius: 8,
                  background: "#009B4D",
                  color: "#fff",
                  cursor: saveBatch.isPending ? "not-allowed" : "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  opacity: saveBatch.isPending ? 0.6 : 1,
                }}
              >
                <Save size={14} />
                {saveBatch.isPending ? "Salvando..." : "Salvar lote"}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {draftPautas.map((draft, index) => (
              <PautaCard
                key={index}
                titulo={draft.titulo}
                pilar={draft.pilar}
                subpilar={draft.subpilar}
                formato={draft.formato_recomendado}
                objetivo={draft.objetivo}
                resumo={draft.resumo}
                justificativa={draft.justificativa}
                prioridade={draft.prioridade}
                status={draft.localStatus}
                onApprove={() => updateDraft(index, { localStatus: "approved" })}
                onReject={() => updateDraft(index, { localStatus: "rejected" })}
                onEditSave={(titulo, resumo) => updateDraft(index, { titulo, resumo })}
              />
            ))}
          </div>
        </div>
      )}

      {/* Saved pautas by batch */}
      {clientId && (
        <div ref={savedSectionRef}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Planejamentos salvos</h2>

          {pautasLoading ? (
            <p style={{ color: "#999" }}>Carregando...</p>
          ) : batches.length === 0 ? (
            <EmptyState
              icon={<LayoutDashboard size={36} />}
              title="Nenhum planejamento salvo"
              description="Gere pautas usando o formulário acima e salve o lote."
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {batches.map((batch) => (
                <div
                  key={batch.batchId}
                  style={{
                    background: "#fff",
                    border: "1px solid #e8e8e8",
                    borderRadius: 10,
                    padding: 20,
                  }}
                >
                  <p style={{ fontSize: 12, color: "#999", marginBottom: 12 }}>
                    Lote de {new Date(batch.date).toLocaleDateString("pt-BR")} &middot;{" "}
                    {batch.pautas.length} pautas &middot;{" "}
                    {batch.pautas.filter((p) => p.status === "approved").length} aprovadas
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {batch.pautas.map((pauta) => (
                      <PautaCard
                        key={pauta.id}
                        titulo={pauta.titulo}
                        pilar={pauta.pilar ?? ""}
                        subpilar={pauta.subpilar ?? ""}
                        formato={pauta.formato ?? ""}
                        objetivo={pauta.objetivo ?? ""}
                        resumo={pauta.resumo ?? ""}
                        justificativa={pauta.justificativa ?? ""}
                        prioridade={pauta.prioridade}
                        status={pauta.status}
                        onApprove={() => handleUpdatePauta(pauta.id, { status: "approved" })}
                        onReject={() => handleUpdatePauta(pauta.id, { status: "rejected" })}
                        onEditSave={(titulo, resumo) =>
                          handleUpdatePauta(pauta.id, { titulo, resumo })
                        }
                        onGeneratePost={
                          pauta.status === "approved" && dna
                            ? () => setPostingPauta(pauta)
                            : undefined
                        }
                        isUpdating={updatePauta.isPending}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* No client selected */}
      {!clientId && (
        <EmptyState
          icon={<LayoutDashboard size={40} />}
          title="Selecione um cliente"
          description="Escolha um cliente para planejar conteúdo."
        />
      )}

      {/* Pauta → Post dialog */}
      {postingPauta && client && dna && (
        <PautaToPostDialog
          open
          onClose={() => setPostingPauta(null)}
          pauta={postingPauta}
          client={client}
          dna={dna}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

interface Batch {
  batchId: string;
  date: string;
  pautas: Pauta[];
}

function groupByBatch(pautas: Pauta[]): Batch[] {
  const map = new Map<string, Pauta[]>();

  for (const pauta of pautas) {
    const existing = map.get(pauta.batch_id);
    if (existing) {
      existing.push(pauta);
    } else {
      map.set(pauta.batch_id, [pauta]);
    }
  }

  return Array.from(map.entries())
    .map(([batchId, batchPautas]) => ({
      batchId,
      date: batchPautas[0]?.created_at ?? "",
      pautas: batchPautas,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}
