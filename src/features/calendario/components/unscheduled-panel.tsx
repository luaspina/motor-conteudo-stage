import { getPostStatusStyle } from "./status-styles";
import type { Post } from "@/features/posts/types";
import type { Pauta } from "@/features/planejamento/types";

interface UnscheduledPanelProps {
  posts: Post[];
  pautas: Pauta[];
  onPostClick: (post: Post) => void;
}

export function UnscheduledPanel({ posts, pautas, onPostClick }: UnscheduledPanelProps) {
  if (posts.length === 0 && pautas.length === 0) return null;

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e8e8e8",
        borderRadius: 10,
        padding: 20,
      }}
    >
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Sem data definida</h3>

      {posts.length > 0 && (
        <div style={{ marginBottom: pautas.length > 0 ? 16 : 0 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", marginBottom: 8 }}>
            Posts ({posts.length})
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {posts.map((post) => {
              const s = getPostStatusStyle(post.status);
              return (
                <button
                  key={post.id}
                  onClick={() => onPostClick(post)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    padding: "8px 12px",
                    border: "1px solid #eee",
                    borderRadius: 8,
                    background: "#fff",
                    cursor: "pointer",
                    fontSize: 13,
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {post.titulo_arte || "Post sem título"}
                  </span>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontSize: 10,
                      fontWeight: 600,
                      color: s.color,
                      background: s.bg,
                      border: `1px solid ${s.border}`,
                      flexShrink: 0,
                    }}
                  >
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {pautas.length > 0 && (
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", marginBottom: 8 }}>
            Pautas aprovadas ({pautas.length})
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {pautas.map((pauta) => (
              <div
                key={pauta.id}
                style={{
                  padding: "8px 12px",
                  border: "1px dashed #d0e8d8",
                  borderRadius: 8,
                  fontSize: 13,
                  color: "#555",
                  background: "#f8fcf9",
                }}
              >
                {pauta.titulo}
                {pauta.formato && (
                  <span style={{ fontSize: 11, color: "#999", marginLeft: 8 }}>
                    {pauta.formato}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
