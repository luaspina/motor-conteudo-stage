import { Link, useNavigate } from "react-router-dom";
import { Share2 } from "lucide-react";
import { ClientContextHeader, ClientSelector, EmptyState } from "@/shared/components";
import { useClientParam } from "@/shared/hooks";
import { usePosts } from "@/features/posts/hooks";
import { useDerivacoes } from "../hooks";
import { DerivacaoCard } from "../components";

export function DerivacoesPage() {
  const navigate = useNavigate();
  const { clientId, client } = useClientParam();
  const { data: posts, isLoading: postsLoading } = usePosts(clientId || undefined);

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Derivações</h1>

      {client && <ClientContextHeader client={client} clientId={clientId} />}

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
          onChange={(id) => navigate(id ? `?clientId=${id}` : "", { replace: true })}
        />
      </div>

      {!clientId && (
        <EmptyState
          icon={<Share2 size={40} />}
          title="Selecione um cliente"
          description="Escolha um cliente para ver as derivações dos posts."
        />
      )}

      {clientId && postsLoading && (
        <p style={{ color: "#999" }}>Carregando posts...</p>
      )}

      {clientId && !postsLoading && !posts?.length && (
        <EmptyState
          icon={<Share2 size={36} />}
          title="Nenhum post encontrado"
          description="Crie posts antes de gerar derivações."
          action={
            <Link
              to={`/posts?clientId=${clientId}`}
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
              Ir para Posts
            </Link>
          }
        />
      )}

      {posts?.map((post) => (
        <PostDerivacoes key={post.id} postId={post.id} postTitle={post.titulo_arte} />
      ))}
    </div>
  );
}

function PostDerivacoes({ postId, postTitle }: { postId: string; postTitle: string | null }) {
  const { data: derivacoes, isLoading } = useDerivacoes(postId);

  if (isLoading) return null;
  if (!derivacoes?.length) return null;

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e8e8e8",
        borderRadius: 10,
        padding: 20,
        marginBottom: 16,
      }}
    >
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
        {postTitle || "Post sem título"}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {derivacoes.map((d) => (
          <DerivacaoCard key={d.id} derivacao={d} />
        ))}
      </div>
    </div>
  );
}
