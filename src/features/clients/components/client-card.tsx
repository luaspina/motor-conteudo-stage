import { Dna, Pencil } from "lucide-react";
import type { Client } from "../types";

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onOpenDna: (clientId: string) => void;
}

export function ClientCard({ client, onEdit, onOpenDna }: ClientCardProps) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e8e8e8",
        borderRadius: 10,
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "box-shadow 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{client.name}</h3>
          {!client.is_active && (
            <span
              style={{
                fontSize: 11,
                padding: "2px 8px",
                background: "#f5f5f5",
                color: "#999",
                borderRadius: 4,
                fontWeight: 500,
              }}
            >
              Inativo
            </span>
          )}
        </div>
        {client.segment && (
          <p style={{ fontSize: 13, color: "#666", margin: 0 }}>{client.segment}</p>
        )}
        <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 12, color: "#999" }}>
          {client.instagram && <span>{client.instagram}</span>}
          {client.whatsapp && <span>{client.whatsapp}</span>}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button
          onClick={() => onEdit(client)}
          title="Editar cliente"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            border: "1px solid #ddd",
            borderRadius: 8,
            background: "#fff",
            cursor: "pointer",
            fontSize: 13,
            color: "#444",
          }}
        >
          <Pencil size={14} />
          Editar
        </button>
        <button
          onClick={() => onOpenDna(client.id)}
          title="Ver DNA"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            border: "none",
            borderRadius: 8,
            background: "#111",
            color: "#fff",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          <Dna size={14} />
          DNA
        </button>
      </div>
    </div>
  );
}
