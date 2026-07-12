import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface DnaSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
  /** Optional badge text shown in the collapsed header */
  badge?: string;
}

export function DnaSection({ title, defaultOpen = false, children, badge }: DnaSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e8e8e8",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "16px 20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 15,
          fontWeight: 600,
          color: "#222",
          textAlign: "left",
        }}
      >
        {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        <span style={{ flex: 1 }}>{title}</span>
        {badge && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: "#888",
              background: "#f0f0f0",
              padding: "2px 8px",
              borderRadius: 10,
              marginRight: 4,
            }}
          >
            {badge}
          </span>
        )}
      </button>
      {open && <div style={{ padding: "0 20px 20px" }}>{children}</div>}
    </div>
  );
}
