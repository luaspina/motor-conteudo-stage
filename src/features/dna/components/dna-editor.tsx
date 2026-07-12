import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import { useUnsavedChanges } from "@/shared/hooks";
import { Button, Dialog, MutationError } from "@/shared/components";
import type { Client } from "@/features/clients/types";
import { dnaFormSchema, type DnaFormValues } from "../types";
import { countSectionFields, sumPilarWeights } from "../types";
import { useSuggestDna } from "../hooks";
import { DnaSection } from "./dna-section";
import { PilaresField } from "./pilares-field";
import { ExemplosAprovadosField, ExemplosReprovadosField } from "./exemplos-field";
import { TemasField } from "./temas-field";
import { AprendizadosField, PerfisReferenciaField } from "./simple-fields";
import { fieldStyles as s } from "./field-styles";

interface DnaEditorProps {
  defaultValues: DnaFormValues;
  onSubmit: (values: DnaFormValues, reset: () => void) => void;
  isSaving: boolean;
  /** Client data used for AI suggestions */
  client?: Client;
}

/** Formats a FieldCount as "X preenchido(s)" or "X itens" for array sections */
function badge(filled: number, total: number, isArray = false): string | undefined {
  if (isArray) return filled > 0 ? `${filled} ${filled === 1 ? "item" : "itens"}` : undefined;
  if (total === 0) return undefined;
  return `${filled}/${total}`;
}

export function DnaEditor({ defaultValues, onSubmit, isSaving, client }: DnaEditorProps) {
  const methods = useForm<DnaFormValues>({
    resolver: zodResolver(dnaFormSchema),
    defaultValues,
  });

  const blocker = useUnsavedChanges(methods.formState.isDirty);
  const suggest = useSuggestDna();

  // Watch the full form to compute live badges — useWatch re-renders only this component
  const values = useWatch({ control: methods.control }) as DnaFormValues;
  const pilarSum = sumPilarWeights(values);
  const pilarWarning = values.pilares.length > 0 && pilarSum !== 100;

  function handleSuggest() {
    if (!client) return;
    suggest.mutate(
      {
        section: "identidade",
        client: {
          name: client.name,
          segment: client.segment,
          instagram: client.instagram,
          site: client.site,
        },
      },
      {
        onSuccess: (response) => {
          const r = response as unknown as { tom_de_voz: string; publico: string; objetivos: string };
          methods.setValue("tom_de_voz", r.tom_de_voz, { shouldDirty: true });
          methods.setValue("publico", r.publico, { shouldDirty: true });
          methods.setValue("objetivos", r.objetivos, { shouldDirty: true });
        },
      },
    );
  }

  function handleSuggestEstilo() {
    if (!client) return;
    suggest.mutate(
      {
        section: "estilo",
        client: {
          name: client.name,
          segment: client.segment,
          instagram: client.instagram,
          site: client.site,
        },
        identidade: {
          tom_de_voz: values.tom_de_voz || undefined,
          publico: values.publico || undefined,
          objetivos: values.objetivos || undefined,
        },
      },
      {
        onSuccess: (response) => {
          const r = response as unknown as { estilo_legenda: string; cta_padrao: string; hashtags_base: string };
          methods.setValue("estilo_legenda", r.estilo_legenda, { shouldDirty: true });
          methods.setValue("cta_padrao", r.cta_padrao, { shouldDirty: true });
          methods.setValue("hashtags_base", r.hashtags_base, { shouldDirty: true });
        },
      },
    );
  }

  return (
    <>
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit((values) => onSubmit(values, () => methods.reset(values)))}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        {/* ── Identidade ── */}
        <DnaSection
          title="Identidade"
          defaultOpen
          badge={badge(countSectionFields(values, "identidade").filled, 3)}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {client && (
              <div>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  icon={<Sparkles size={14} />}
                  onClick={handleSuggest}
                  disabled={suggest.isPending}
                >
                  {suggest.isPending ? "Gerando..." : "✨ Gerar com IA"}
                </Button>
                <MutationError error={suggest.error} />
              </div>
            )}
            <div>
              <label style={s.label}>Tom de voz</label>
              <textarea {...methods.register("tom_de_voz")} style={s.textarea} />
            </div>
            <div>
              <label style={s.label}>Público</label>
              <textarea {...methods.register("publico")} style={s.textarea} />
            </div>
            <div>
              <label style={s.label}>Objetivos</label>
              <textarea {...methods.register("objetivos")} style={s.textarea} />
            </div>
          </div>
        </DnaSection>

        {/* ── Pilares ── */}
        <DnaSection
          title="Pilares com peso"
          badge={badge(countSectionFields(values, "pilares").filled, 0, true)}
        >
          <PilaresField />
          {pilarWarning && (
            <p
              style={{
                fontSize: 12,
                color: "#b36b00",
                background: "#fff3d6",
                padding: "8px 12px",
                borderRadius: 6,
                marginTop: 10,
              }}
            >
              ⚠️ A soma dos pesos é {pilarSum}%. O total deve ser 100%.
            </p>
          )}
        </DnaSection>

        {/* ── Estilo ── */}
        <DnaSection
          title="Estilo"
          badge={badge(countSectionFields(values, "estilo").filled, 3)}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {client && (
              <div>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  icon={<Sparkles size={14} />}
                  onClick={handleSuggestEstilo}
                  disabled={suggest.isPending}
                >
                  {suggest.isPending ? "Gerando..." : "✨ Gerar com IA"}
                </Button>
                <MutationError error={suggest.error} />
              </div>
            )}
            <div>
              <label style={s.label}>Estilo de legenda</label>
              <textarea
                {...methods.register("estilo_legenda")}
                style={{ ...s.textarea, minHeight: 120 }}
              />
            </div>
            <div>
              <label style={s.label}>CTA padrão</label>
              <textarea {...methods.register("cta_padrao")} style={s.textarea} />
            </div>
            <div>
              <label style={s.label}>Hashtags base</label>
              <textarea {...methods.register("hashtags_base")} style={s.textarea} />
            </div>
          </div>
        </DnaSection>

        {/* ── Linguagem ── */}
        <DnaSection
          title="Linguagem"
          badge={badge(countSectionFields(values, "linguagem").filled, 4)}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={s.label}>Palavras preferidas</label>
              <textarea {...methods.register("palavras_preferidas")} style={s.textarea} />
            </div>
            <div>
              <label style={s.label}>Palavras a evitar</label>
              <textarea {...methods.register("palavras_evitar")} style={s.textarea} />
            </div>
            <div>
              <label style={s.label}>O que nunca fazer</label>
              <textarea
                {...methods.register("o_que_nao_fazer")}
                style={{ ...s.textarea, minHeight: 100 }}
              />
            </div>
            <div>
              <label style={s.label}>Temas proibidos</label>
              <textarea {...methods.register("temas_proibidos")} style={s.textarea} />
            </div>
          </div>
        </DnaSection>

        {/* ── Regras ── */}
        <DnaSection
          title="Regras específicas"
          badge={badge(countSectionFields(values, "regras").filled, 1)}
        >
          <div>
            <label style={s.label}>Regras</label>
            <textarea
              {...methods.register("regras")}
              style={{ ...s.textarea, minHeight: 120 }}
            />
          </div>
        </DnaSection>

        {/* ── Exemplos ── */}
        <DnaSection
          title="Exemplos aprovados"
          badge={badge(countSectionFields(values, "exemplos_aprovados").filled, 0, true)}
        >
          <ExemplosAprovadosField />
        </DnaSection>

        <DnaSection
          title="Exemplos reprovados"
          badge={badge(countSectionFields(values, "exemplos_reprovados").filled, 0, true)}
        >
          <ExemplosReprovadosField />
        </DnaSection>

        {/* ── Referências ── */}
        <DnaSection
          title="Perfis de referência"
          badge={badge(countSectionFields(values, "perfis_referencia").filled, 0, true)}
        >
          <PerfisReferenciaField />
        </DnaSection>

        {/* ── Inteligência editorial ── */}
        <DnaSection
          title="Temas já cobertos"
          badge={badge(countSectionFields(values, "temas_cobertos").filled, 0, true)}
        >
          <TemasField />
        </DnaSection>

        <DnaSection
          title="Aprendizados"
          badge={badge(countSectionFields(values, "aprendizados").filled, 0, true)}
        >
          <AprendizadosField />
        </DnaSection>

        {/* ── Observações ── */}
        <DnaSection
          title="Observações"
          badge={badge(countSectionFields(values, "observacoes").filled, 1)}
        >
          <div>
            <label style={s.label}>Observações gerais da marca</label>
            <textarea {...methods.register("observacoes")} style={s.textarea} />
          </div>
        </DnaSection>

        {/* ── Save ── */}
        <div
          style={{
            position: "sticky",
            bottom: 0,
            background: "#fafafa",
            padding: "16px 0",
            borderTop: "1px solid #e8e8e8",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="submit"
            disabled={isSaving}
            style={{
              padding: "12px 32px",
              border: "none",
              borderRadius: 8,
              background: "#111",
              color: "#fff",
              cursor: isSaving ? "not-allowed" : "pointer",
              fontSize: 14,
              fontWeight: 600,
              opacity: isSaving ? 0.6 : 1,
            }}
          >
            {isSaving ? "Salvando..." : "Salvar DNA"}
          </button>
        </div>
      </form>
    </FormProvider>

    <Dialog
      open={blocker.state === "blocked"}
      onClose={() => blocker.reset?.()}
      title="Alterações não salvas"
    >
      <p style={{ fontSize: 14, color: "#444", marginBottom: 20, lineHeight: 1.6 }}>
        Existem alterações não salvas no DNA. Deseja sair mesmo assim?
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <Button variant="neutral" onClick={() => blocker.reset?.()}>
          Continuar editando
        </Button>
        <Button variant="danger" onClick={() => blocker.proceed?.()}>
          Sair sem salvar
        </Button>
      </div>
    </Dialog>
    </>
  );
}
