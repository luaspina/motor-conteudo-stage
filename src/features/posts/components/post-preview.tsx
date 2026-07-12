import { Save, RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import { Button, CopyButton } from "@/shared/components";
import type { GeneratedPostData } from "../types";

interface PostPreviewProps {
  data: GeneratedPostData;
  onSave: () => void;
  onDiscard: () => void;
  isSaving: boolean;
}

export function PostPreview({ data, onSave, onDiscard, isSaving }: PostPreviewProps) {
  const allHashtags = [data.hashtags_fixas, data.hashtags_var, data.hashtags_locais]
    .filter(Boolean)
    .join(" ");

  return (
    <div>
      {/* Actions */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <Button
          variant="success"
          icon={<Save size={16} />}
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? "Salvando..." : "Salvar post"}
        </Button>
        <Button
          variant="neutral"
          icon={<RotateCcw size={16} />}
          onClick={onDiscard}
          disabled={isSaving}
        >
          Descartar e gerar outro
        </Button>
        <CopyButton
          text={formatPostForClipboard(data)}
          label="Copiar tudo formatado"
        />
      </div>

      {/* Content */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <CopyableField label="Título da arte" text={data.titulo_arte} />
          <CopyableField label="Texto da arte" text={data.texto_arte} />
          <CopyableField label="Legenda" text={data.legenda} />
          <CopyableField label="CTA" text={data.cta} />
        </div>

        <div>
          <CopyableField label="Hashtags fixas" text={data.hashtags_fixas} />
          <CopyableField label="Hashtags variáveis (tema)" text={data.hashtags_var} />
          <CopyableField label="Hashtags locais" text={data.hashtags_locais} />
          {allHashtags && (
            <CopyableField label="Todas as hashtags" text={allHashtags} />
          )}
          <CopyableField label="Observações de design" text={data.obs_design} />

          <div style={{ marginBottom: 20 }}>
            <p style={labelStyle}>Formato / Objetivo / Subpilar</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Tag label={data.formato_sugerido} />
              <Tag label={data.objetivo} />
              {data.subpilar && <Tag label={data.subpilar} />}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <p style={labelStyle}>Checklist de aderência</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {Object.entries(data.checklist).map(([key, value]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                  {value ? (
                    <CheckCircle2 size={16} color="#009B4D" />
                  ) : (
                    <XCircle size={16} color="#d32f2f" />
                  )}
                  <span>{formatChecklistKey(key)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: "#999",
  textTransform: "uppercase",
  letterSpacing: 0.5,
  marginBottom: 6,
};

function CopyableField({ label, text }: { label: string; text: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ ...labelStyle, marginBottom: 0 }}>{label}</p>
        {text && <CopyButton text={text} compact />}
      </div>
      <div
        style={{
          background: "#f8f8f8",
          borderRadius: 8,
          padding: "12px 16px",
          fontSize: 14,
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
          marginTop: 6,
        }}
      >
        {text || "—"}
      </div>
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span
      style={{
        padding: "4px 10px",
        background: "#eee",
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 500,
        color: "#444",
      }}
    >
      {label}
    </span>
  );
}

function formatChecklistKey(key: string): string {
  const map: Record<string, string> = {
    seguiu_formula: "Seguiu fórmula",
    respeitou_tom: "Respeitou tom de voz",
    sem_palavras_proibidas: "Sem palavras proibidas",
    tema_novo: "Tema novo",
    pilar_correto: "Pilar correto",
    cta_correto: "CTA correto",
    objetivo_atendido: "Objetivo atendido",
    dentro_limite_caracteres: "Dentro do limite de caracteres",
  };
  return map[key] ?? key.replace(/_/g, " ");
}

// ── Clipboard formatter ──────────────────────────────────────

function formatPostForClipboard(data: GeneratedPostData): string {
  const hashtags = [data.hashtags_fixas, data.hashtags_var, data.hashtags_locais]
    .filter(Boolean)
    .join(" ");

  const parts = [
    section("TÍTULO DA ARTE", data.titulo_arte),
    section("TEXTO DA ARTE", data.texto_arte),
    section("LEGENDA", data.legenda),
    section("CTA", data.cta),
    section("HASHTAGS", hashtags),
    section("OBSERVAÇÕES DE DESIGN", data.obs_design),
  ];

  return parts.filter(Boolean).join("\n\n");
}

function section(title: string, content: string): string {
  if (!content) return "";
  return `${title}:\n${content}`;
}
