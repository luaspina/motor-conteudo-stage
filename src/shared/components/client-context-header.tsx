import { NavLink } from "react-router-dom";
import { Dna, FileText, Share2, LayoutDashboard, Calendar } from "lucide-react";
import type { Client } from "@/features/clients/types";

interface ClientContextHeaderProps {
  client: Client;
  clientId: string;
}

const LINKS = [
  { to: "/dna", label: "DNA", icon: Dna },
  { to: "/planejamento", label: "Planejamento", icon: LayoutDashboard },
  { to: "/posts", label: "Posts", icon: FileText },
  { to: "/derivacoes", label: "Derivações", icon: Share2 },
  { to: "/calendario", label: "Calendário", icon: Calendar },
] as const;

export function ClientContextHeader({ client, clientId }: ClientContextHeaderProps) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e8e8e8",
        borderRadius: 10,
        padding: "14px 20px",
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        gap: 24,
        flexWrap: "wrap",
      }}
    >
      {/* Client identity */}
      <div style={{ flexShrink: 0 }}>
        <p style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{client.name}</p>
        {client.segment && (
          <p style={{ fontSize: 12, color: "#888", margin: 0 }}>{client.segment}</p>
        )}
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 28, background: "#e8e8e8", flexShrink: 0 }} />

      {/* Quick links */}
      <nav style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={`${to}?clientId=${clientId}`}
            style={({ isActive }) => ({
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 12px",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
              textDecoration: "none",
              color: isActive ? "#009B4D" : "#555",
              background: isActive ? "#e6f7ed" : "transparent",
              border: `1px solid ${isActive ? "#b8e6cc" : "#e8e8e8"}`,
              transition: "all 0.15s",
            })}
          >
            <Icon size={13} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
