import { CopyButton } from "@/shared/components";
import { DERIVACAO_LABELS, type Derivacao } from "../types";

interface DerivacaoCardProps {
  derivacao: Derivacao;
}

export function DerivacaoCard({ derivacao }: DerivacaoCardProps) {
  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: 8,
        padding: "12px 16px",
        background: "#fafafa",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span
          style={{
            padding: "3px 10px",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            background: "#e3f0fa",
            color: "#1a6fb5",
          }}
        >
          {DERIVACAO_LABELS[derivacao.tipo]}
        </span>
        <span style={{ fontSize: 11, color: "#999" }}>
          {new Date(derivacao.created_at).toLocaleDateString("pt-BR")}
        </span>
        <span style={{ marginLeft: "auto" }}>
          {derivacao.conteudo && <CopyButton text={derivacao.conteudo} compact />}
        </span>
      </div>
      {derivacao.conteudo && (
        <div
          style={{
            fontSize: 13,
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
            maxHeight: 200,
            overflowY: "auto",
            color: "#444",
          }}
        >
          {derivacao.conteudo}
        </div>
      )}
    </div>
  );
}
