import { useState } from "react";
import { Dialog } from "@/shared/components";
import { getPostStatusStyle } from "./status-styles";
import type { Post } from "@/features/posts/types";

interface DateEditDialogProps {
  open: boolean;
  onClose: () => void;
  post: Post;
  onSave: (postId: string, data: { data_sugerida?: string | null; status?: Post["status"] }) => void;
  isSaving: boolean;
}

const POST_STATUSES: { value: Post["status"]; label: string }[] = [
  { value: "idea", label: "Rascunho" },
  { value: "approved", label: "Aprovado" },
  { value: "em_producao", label: "Em produção" },
  { value: "finalizado", label: "Finalizado" },
  { value: "publicado", label: "Publicado" },
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #ddd",
  borderRadius: 8,
  fontSize: 14,
  outline: "none",
};

export function DateEditDialog({ open, onClose, post, onSave, isSaving }: DateEditDialogProps) {
  const [date, setDate] = useState(post.data_sugerida ?? "");
  const [status, setStatus] = useState<Post["status"]>(post.status);

  const currentStyle = getPostStatusStyle(status);

  function handleSave() {
    onSave(post.id, {
      data_sugerida: date || null,
      status,
    });
  }

  return (
    <Dialog open={open} onClose={onClose} title="Editar post">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
            {post.titulo_arte || "Post sem título"}
          </p>
          {post.legenda && (
            <p
              style={{
                fontSize: 13,
                color: "#666",
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

        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#444", marginBottom: 4 }}>
            Data sugerida
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#444", marginBottom: 4 }}>
            Status
          </label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {POST_STATUSES.map((s) => {
              const style = getPostStatusStyle(s.value);
              const isSelected = s.value === status;
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStatus(s.value)}
                  style={{
                    padding: "6px 14px",
                    border: `1px solid ${isSelected ? style.border : "#eee"}`,
                    borderLeft: isSelected ? `3px solid ${style.dot}` : "1px solid #eee",
                    borderRadius: 8,
                    background: isSelected ? style.bg : "#fff",
                    color: isSelected ? style.color : "#999",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: isSelected ? 600 : 400,
                  }}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
          <p style={{ fontSize: 12, color: currentStyle.color, marginTop: 6 }}>
            Status atual: {POST_STATUSES.find((s) => s.value === status)?.label}
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
              border: "1px solid #ddd",
              borderRadius: 8,
              background: "#fff",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              padding: "10px 24px",
              border: "none",
              borderRadius: 8,
              background: "#111",
              color: "#fff",
              cursor: isSaving ? "not-allowed" : "pointer",
              fontSize: 14,
              fontWeight: 500,
              opacity: isSaving ? 0.6 : 1,
            }}
          >
            {isSaving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
