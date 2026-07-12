import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import {
  ClientContextHeader,
  ClientSelector,
  EmptyState,
  Toast,
  MutationError,
} from "@/shared/components";
import { useClientParam, useToast } from "@/shared/hooks";
import { useDna } from "@/features/dna/hooks";
import { DerivacaoDialog } from "@/features/derivacoes/components";
import { usePosts, useGeneratePost, useCreatePost } from "../hooks";
import { PostGeneratorForm, PostPreview, PostCard } from "../components";
import type { Post, GeneratePostFormValues, GeneratedPostData } from "../types";

export function PostsPage() {
  const navigate = useNavigate();
  const { clientId, client } = useClientParam();
  const [generatedData, setGeneratedData] = useState<GeneratedPostData | null>(null);
  const [derivatingPost, setDerivatingPost] = useState<Post | null>(null);

  const { data: dna, isLoading: dnaLoading } = useDna(clientId || undefined);
  const { data: posts, isLoading: postsLoading } = usePosts(clientId || undefined);
  const generatePost = useGeneratePost();
  const createPost = useCreatePost();
  const { toast, show: showToast } = useToast();

  function handleClientChange(id: string) {
    if (generatedData) {
      const confirmed = window.confirm(
        "Você tem conteúdo gerado ainda não salvo. Se trocar de cliente, esse conteúdo será descartado. Deseja continuar?",
      );
      if (!confirmed) return;
    }
    setGeneratedData(null);
    generatePost.reset();
    navigate(id ? `?clientId=${id}` : "", { replace: true });
  }

  function handleGenerate(values: GeneratePostFormValues) {
    if (!client || !dna) return;
    generatePost.mutate(
      { client, dna, pauta: values },
      {
        onSuccess: (response) => {
          if (response.data) setGeneratedData(response.data);
        },
      },
    );
  }

  function handleSave() {
    if (!generatedData || !clientId) return;
    createPost.mutate(
      {
        client_id: clientId,
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
          setGeneratedData(null);
          generatePost.reset();
          showToast("Post salvo com sucesso");
        },
      },
    );
  }

  function handleDiscard() {
    setGeneratedData(null);
    generatePost.reset();
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Posts</h1>

      {client && <ClientContextHeader client={client} clientId={clientId} />}

      {/* Client selector */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e8e8e8",
          borderRadius: 10,
          padding: 20,
          marginBottom: 24,
        }}
      >
        <ClientSelector
          value={clientId}
          onChange={(id) => handleClientChange(id)}
        />
        {clientId && dnaLoading && (
          <p style={{ fontSize: 13, color: "#999", marginTop: 10 }}>Carregando DNA...</p>
        )}
        {clientId && !dnaLoading && !dna && (
          <p style={{ fontSize: 13, color: "#d32f2f", marginTop: 10 }}>
            Este cliente ainda não tem DNA cadastrado. Configure o DNA antes de gerar posts.
          </p>
        )}
      </div>

      {/* Generator or Preview */}
      {clientId && dna && !generatedData && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e8e8e8",
            borderRadius: 10,
            padding: 24,
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Gerar novo post</h2>
          <PostGeneratorForm onSubmit={handleGenerate} isGenerating={generatePost.isPending} />
          <MutationError error={generatePost.error} />
        </div>
      )}

      {generatedData && (
        <div
          style={{
            background: "#fff",
            border: "2px solid #009B4D",
            borderRadius: 10,
            padding: 24,
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Post gerado</h2>
          <PostPreview
            data={generatedData}
            onSave={handleSave}
            onDiscard={handleDiscard}
            isSaving={createPost.isPending}
          />
        </div>
      )}

      {/* Saved posts list */}
      {clientId && (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Posts salvos</h2>
          {postsLoading ? (
            <p style={{ color: "#999" }}>Carregando posts...</p>
          ) : !posts?.length ? (
            <EmptyState
              icon={<FileText size={36} />}
              title="Nenhum post salvo"
              description="Gere seu primeiro post usando o formulário acima, ou crie pautas no Planejamento."
              action={
                <Link
                  to={`/planejamento?clientId=${clientId}`}
                  style={{
                    padding: "8px 16px",
                    background: "#111",
                    color: "#fff",
                    borderRadius: 8,
                    textDecoration: "none",
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  Ir para Planejamento
                </Link>
              }
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onDerivate={dna ? setDerivatingPost : undefined}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {!clientId && (
        <EmptyState
          icon={<FileText size={40} />}
          title="Selecione um cliente"
          description="Escolha um cliente acima para gerar posts e ver o histórico."
        />
      )}

      {derivatingPost && client && dna && (
        <DerivacaoDialog
          open
          onClose={() => setDerivatingPost(null)}
          post={derivatingPost}
          client={client}
          dna={dna}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
