import { Share2 } from "lucide-react";
import type { Post } from "../types";

interface PostCardProps {
  post: Post;
  onDerivate?: (post: Post) => void;
}

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  idea: { label: "Rascunho", color: "#666", bg: "#f0f0f0" },
  approved: { label: "Aprovado", color: "#009B4D", bg: "#e6f7ed" },
  em_producao: { label: "Em produção", color: "#b36b00", bg: "#fff3d6" },
  finalizado: { label: "Finalizado", color: "#1a6fb5", bg: "#e3f0fa" },
  publicado: { label: "Publicado", color: "#6b21a8", bg: "#f3e8ff" },
};

const FALLBACK = { label: "Rascunho", color: "#666", bg: "#f0f0f0" };

export function PostCard({ post, onDerivate }: PostCardProps) {
  const status = STATUS_LABELS[post.status] ?? FALLBACK;

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e8e8e8",
        borderRadius: 10,
        padding: "16px 20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 4px" }}>
            {post.titulo_arte || "Post sem título"}
          </h3>
          {post.legenda && (
            <p
              style={{
                fontSize: 13,
                color: "#666",
                margin: 0,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {post.legenda}
            </p>
          )}
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
          {post.formato && (
            <span style={{ fontSize: 12, color: "#999" }}>{post.formato}</span>
          )}
          <span
            style={{
              padding: "3px 10px",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              color: status.color,
              background: status.bg,
            }}
          >
            {status.label}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
        <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#999" }}>
          {post.objetivo && <span>Objetivo: {post.objetivo}</span>}
          {post.subpilar && <span>Subpilar: {post.subpilar}</span>}
          <span>{new Date(post.created_at).toLocaleDateString("pt-BR")}</span>
        </div>

        {onDerivate && (
          <button
            onClick={() => onDerivate(post)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              border: "1px solid #ddd",
              borderRadius: 8,
              background: "#fff",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 500,
              color: "#444",
            }}
          >
            <Share2 size={13} />
            Derivar
          </button>
        )}
      </div>
    </div>
  );
}
