import { useState } from "react";
import { Sparkles, Save, RotateCcw } from "lucide-react";
import { Dialog, CopyButton } from "@/shared/components";
import type { Client } from "@/features/clients/types";
import type { ClientDna } from "@/features/dna/types";
import type { Post } from "@/features/posts/types";
import { useGenerateDerivacao, useCreateDerivacao } from "../hooks";
import { DERIVACAO_TIPOS, DERIVACAO_LABELS, type DerivacaoTipo } from "../types";

interface DerivacaoDialogProps {
  open: boolean;
  onClose: () => void;
  post: Post;
  client: Client;
  dna: ClientDna;
}

export function DerivacaoDialog({ open, onClose, post, client, dna }: DerivacaoDialogProps) {
  const [selectedTipo, setSelectedTipo] = useState<DerivacaoTipo | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

  const generate = useGenerateDerivacao();
  const save = useCreateDerivacao();

  function handleGenerate(tipo: DerivacaoTipo) {
    setSelectedTipo(tipo);
    setGeneratedContent(null);

    generate.mutate(
      {
        client,
        dna,
        input: { legenda: post.legenda || "", tipo },
      },
      {
        onSuccess: (response) => {
          setGeneratedContent(response.raw || "");
        },
      },
    );
  }

  function handleSave() {
    if (!selectedTipo || !generatedContent) return;

    save.mutate(
      { post_id: post.id, tipo: selectedTipo, conteudo: generatedContent },
      {
        onSuccess: () => {
          handleReset();
          onClose();
        },
      },
    );
  }

  function handleReset() {
    setSelectedTipo(null);
    setGeneratedContent(null);
    generate.reset();
  }

  function handleClose() {
    handleReset();
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} title="Gerar derivação">
      <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>
        Post: <strong>{post.titulo_arte || "Sem título"}</strong>
      </p>

      {/* ── Format selection ── */}
      {!generatedContent && !generate.isPending && (
        <div>
          <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>
            Escolha o formato:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {DERIVACAO_TIPOS.map((tipo) => (
              <button
                key={tipo}
                onClick={() => handleGenerate(tipo)}
                style={{
                  padding: "14px 16px",
                  border: "1px solid #ddd",
                  borderRadius: 10,
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 500,
                  textAlign: "left",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#111";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#ddd";
                }}
              >
                {DERIVACAO_LABELS[tipo]}
                <span style={{ display: "block", fontSize: 11, color: "#999", marginTop: 2 }}>
                  {formatDescription(tipo)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Generating ── */}
      {generate.isPending && (
        <div style={{ textAlign: "center", padding: "32px 0", color: "#666" }}>
          <Sparkles size={24} style={{ marginBottom: 8, opacity: 0.5 }} />
          <p style={{ fontSize: 14 }}>
            Gerando {selectedTipo ? DERIVACAO_LABELS[selectedTipo] : ""}...
          </p>
        </div>
      )}

      {/* ── Error ── */}
      {generate.isError && (
        <div style={{ padding: 16, textAlign: "center" }}>
          <p style={{ color: "#d32f2f", fontSize: 13, marginBottom: 12 }}>
            Erro: {generate.error.message}
          </p>
          <button
            onClick={handleReset}
            style={{
              padding: "8px 16px",
              border: "1px solid #ddd",
              borderRadius: 8,
              background: "#fff",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* ── Preview ── */}
      {generatedContent && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", margin: 0 }}>
              {selectedTipo ? DERIVACAO_LABELS[selectedTipo] : ""} gerado
            </p>
            <CopyButton text={generatedContent} />
          </div>
          <div
            style={{
              background: "#f8f8f8",
              borderRadius: 8,
              padding: "16px 20px",
              fontSize: 14,
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
              maxHeight: 400,
              overflowY: "auto",
              marginBottom: 16,
            }}
          >
            {generatedContent}
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button
              onClick={handleReset}
              disabled={save.isPending}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 16px",
                border: "1px solid #ddd",
                borderRadius: 8,
                background: "#fff",
                cursor: "pointer",
                fontSize: 13,
                color: "#666",
              }}
            >
              <RotateCcw size={14} />
              Gerar outro
            </button>
            <button
              onClick={handleSave}
              disabled={save.isPending}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 20px",
                border: "none",
                borderRadius: 8,
                background: "#009B4D",
                color: "#fff",
                cursor: save.isPending ? "not-allowed" : "pointer",
                fontSize: 13,
                fontWeight: 600,
                opacity: save.isPending ? 0.6 : 1,
              }}
            >
              <Save size={14} />
              {save.isPending ? "Salvando..." : "Salvar derivação"}
            </button>
          </div>
        </div>
      )}
    </Dialog>
  );
}

function formatDescription(tipo: DerivacaoTipo): string {
  const descriptions: Record<DerivacaoTipo, string> = {
    reels: "Roteiro em cenas com fala e legenda",
    story: "Sequência de telas curtas com CTA",
    linkedin: "Tom profissional, 1ª pessoa",
    facebook: "Tom informal, sem hashtags excessivas",
  };
  return descriptions[tipo];
}
