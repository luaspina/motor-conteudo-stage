import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Dialog } from "@/shared/components";
import { PostPreview } from "@/features/posts/components";
import { useGeneratePost, useCreatePost } from "@/features/posts/hooks";
import type { Client } from "@/features/clients/types";
import type { ClientDna } from "@/features/dna/types";
import type { GeneratedPostData } from "@/features/posts/types";
import type { Pauta } from "../types";

interface PautaToPostDialogProps {
  open: boolean;
  onClose: () => void;
  pauta: Pauta;
  client: Client;
  dna: ClientDna;
}

export function PautaToPostDialog({ open, onClose, pauta, client, dna }: PautaToPostDialogProps) {
  const [generatedData, setGeneratedData] = useState<GeneratedPostData | null>(null);

  const generatePost = useGeneratePost();
  const createPost = useCreatePost();

  function handleGenerate() {
    generatePost.mutate(
      {
        client,
        dna,
        pauta: {
          titulo: pauta.titulo,
          pilar: pauta.pilar ?? "",
          subpilar: pauta.subpilar ?? "",
          formato: pauta.formato ?? "carrossel",
          objetivo: pauta.objetivo ?? "educativo",
          resumo: pauta.resumo ?? "",
        },
      },
      {
        onSuccess: (response) => {
          if (response.data) {
            setGeneratedData(response.data);
          }
        },
      },
    );
  }

  function handleSave() {
    if (!generatedData) return;

    createPost.mutate(
      {
        client_id: client.id,
        pauta_id: pauta.id,
        titulo_arte: generatedData.titulo_arte,
        texto_arte: generatedData.texto_arte,
        legenda: generatedData.legenda,
        cta: generatedData.cta,
        hashtags_fixas: generatedData.hashtags_fixas,
        hashtags_var: generatedData.hashtags_var,
        hashtags_locais: generatedData.hashtags_locais,
        obs_design: generatedData.obs_design,
        formato: generatedData.formato_sugerido,
        objetivo: generatedData.objetivo,
        subpilar: generatedData.subpilar,
        checklist: generatedData.checklist,
        generated_at: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  }

  function handleClose() {
    setGeneratedData(null);
    generatePost.reset();
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title={`Gerar post: ${pauta.titulo}`}
    >
      {/* Step 1: Confirm and generate */}
      {!generatedData && !generatePost.isPending && (
        <div>
          <div style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>
            <p style={{ marginBottom: 6 }}>
              <strong>Pilar:</strong> {pauta.pilar ?? "—"} &middot;{" "}
              <strong>Formato:</strong> {pauta.formato ?? "—"} &middot;{" "}
              <strong>Objetivo:</strong> {pauta.objetivo ?? "—"}
            </p>
            {pauta.resumo && <p>{pauta.resumo}</p>}
          </div>
          <button
            onClick={handleGenerate}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 24px",
              border: "none",
              borderRadius: 8,
              background: "#111",
              color: "#fff",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Sparkles size={16} />
            Gerar post com IA
          </button>
        </div>
      )}

      {/* Step 2: Loading */}
      {generatePost.isPending && (
        <div style={{ textAlign: "center", padding: "32px 0", color: "#666" }}>
          <Sparkles size={24} style={{ marginBottom: 8, opacity: 0.5 }} />
          <p style={{ fontSize: 14 }}>Gerando post...</p>
        </div>
      )}

      {/* Error */}
      {generatePost.isError && (
        <div style={{ textAlign: "center", padding: 16 }}>
          <p style={{ color: "#d32f2f", fontSize: 13, marginBottom: 12 }}>
            Erro: {generatePost.error.message}
          </p>
          <button
            onClick={handleGenerate}
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

      {/* Step 3: Preview */}
      {generatedData && (
        <PostPreview
          data={generatedData}
          onSave={handleSave}
          onDiscard={() => {
            setGeneratedData(null);
            generatePost.reset();
          }}
          isSaving={createPost.isPending}
        />
      )}
    </Dialog>
  );
}
