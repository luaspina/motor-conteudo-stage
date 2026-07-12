import { useState } from "react";
import { Check, X, FileText, Pencil } from "lucide-react";
import type { PautaStatus, PautaPrioridade } from "../types";

interface PautaCardProps {
  titulo: string;
  pilar: string;
  subpilar: string;
  formato: string;
  objetivo: string;
  resumo: string;
  justificativa: string;
  prioridade: PautaPrioridade;
  status: PautaStatus;
  onApprove: () => void;
  onReject: () => void;
  onEditSave?: (titulo: string, resumo: string) => void;
  onGeneratePost?: () => void;
  isUpdating?: boolean;
}

const PRIORIDADE_STYLES: Record<PautaPrioridade, { color: string; bg: string }> = {
  alta: { color: "#c33", bg: "#fee" },
  media: { color: "#b36b00", bg: "#fff3d6" },
  baixa: { color: "#666", bg: "#f0f0f0" },
};

const STATUS_STYLES: Record<PautaStatus, { label: string; color: string; bg: string }> = {
  idea: { label: "Pendente", color: "#666", bg: "#f0f0f0" },
  approved: { label: "Aprovada", color: "#009B4D", bg: "#e6f7ed" },
  rejected: { label: "Rejeitada", color: "#c33", bg: "#fee" },
};

export function PautaCard({
  titulo,
  pilar,
  subpilar,
  formato,
  objetivo,
  resumo,
  justificativa,
  prioridade,
  status,
  onApprove,
  onReject,
  onEditSave,
  onGeneratePost,
  isUpdating,
}: PautaCardProps) {
  const [editing, setEditing] = useState(false);
  const [editTitulo, setEditTitulo] = useState(titulo);
  const [editResumo, setEditResumo] = useState(resumo);

  const pStyle = PRIORIDADE_STYLES[prioridade];
  const sStyle = STATUS_STYLES[status];

  function handleSaveEdit() {
    onEditSave?.(editTitulo, editResumo);
    setEditing(false);
  }

  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${status === "rejected" ? "#f0d0d0" : "#e8e8e8"}`,
        borderRadius: 10,
        padding: "16px 20px",
        opacity: status === "rejected" ? 0.6 : 1,
        transition: "opacity 0.15s",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {editing ? (
            <input
              value={editTitulo}
              onChange={(e) => setEditTitulo(e.target.value)}
              style={{
                width: "100%",
                padding: "6px 10px",
                border: "1px solid #ddd",
                borderRadius: 6,
                fontSize: 15,
                fontWeight: 600,
                outline: "none",
              }}
            />
          ) : (
            <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{titulo}</h3>
          )}
        </div>

        <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
          <span
            style={{
              padding: "3px 8px",
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 600,
              color: pStyle.color,
              background: pStyle.bg,
            }}
          >
            {prioridade}
          </span>
          <span
            style={{
              padding: "3px 8px",
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 600,
              color: sStyle.color,
              background: sStyle.bg,
            }}
          >
            {sStyle.label}
          </span>
        </div>
      </div>

      {/* Meta */}
      <div style={{ display: "flex", gap: 12, marginTop: 8, fontSize: 12, color: "#999", flexWrap: "wrap" }}>
        {pilar && <span>Pilar: {pilar}</span>}
        {subpilar && <span>Subpilar: {subpilar}</span>}
        {formato && <span>Formato: {formato}</span>}
        {objetivo && <span>Objetivo: {objetivo}</span>}
      </div>

      {/* Resumo */}
      {editing ? (
        <textarea
          value={editResumo}
          onChange={(e) => setEditResumo(e.target.value)}
          style={{
            width: "100%",
            marginTop: 10,
            padding: "8px 10px",
            border: "1px solid #ddd",
            borderRadius: 6,
            fontSize: 13,
            fontFamily: "inherit",
            resize: "vertical",
            minHeight: 50,
            outline: "none",
          }}
        />
      ) : (
        resumo && (
          <p style={{ fontSize: 13, color: "#555", marginTop: 10, lineHeight: 1.5 }}>{resumo}</p>
        )
      )}

      {/* Justificativa */}
      {justificativa && !editing && (
        <p style={{ fontSize: 12, color: "#888", marginTop: 6, fontStyle: "italic" }}>
          {justificativa}
        </p>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        {status !== "approved" && (
          <ActionButton
            icon={<Check size={14} />}
            label="Aprovar"
            onClick={onApprove}
            disabled={isUpdating}
            variant="approve"
          />
        )}
        {status !== "rejected" && (
          <ActionButton
            icon={<X size={14} />}
            label="Rejeitar"
            onClick={onReject}
            disabled={isUpdating}
            variant="reject"
          />
        )}
        {onEditSave && !editing && (
          <ActionButton
            icon={<Pencil size={14} />}
            label="Editar"
            onClick={() => setEditing(true)}
            disabled={isUpdating}
            variant="neutral"
          />
        )}
        {editing && (
          <>
            <ActionButton label="Salvar edição" onClick={handleSaveEdit} variant="approve" />
            <ActionButton
              label="Cancelar"
              onClick={() => {
                setEditing(false);
                setEditTitulo(titulo);
                setEditResumo(resumo);
              }}
              variant="neutral"
            />
          </>
        )}
        {status === "approved" && onGeneratePost && (
          <ActionButton
            icon={<FileText size={14} />}
            label="Gerar Post"
            onClick={onGeneratePost}
            variant="primary"
          />
        )}
      </div>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  disabled,
  variant,
}: {
  icon?: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant: "approve" | "reject" | "neutral" | "primary";
}) {
  function getStyle(v: string) {
    switch (v) {
      case "approve": return { color: "#009B4D", borderColor: "#b8e6cc", background: "#fff" };
      case "reject": return { color: "#c33", borderColor: "#f0d0d0", background: "#fff" };
      case "primary": return { color: "#fff", borderColor: "#009B4D", background: "#009B4D" };
      default: return { color: "#666", borderColor: "#ddd", background: "#fff" };
    }
  }
  const s = getStyle(variant);
  const isPrimary = variant === "primary";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: isPrimary ? "8px 18px" : "6px 12px",
        border: `1px solid ${s.borderColor}`,
        borderRadius: 6,
        background: s.background,
        color: s.color,
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 12,
        fontWeight: 500,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {icon}
      {label}
    </button>
  );
}
