import { Outlet, NavLink } from "react-router-dom";
import { Users, Dna, FileText, Share2, LayoutDashboard, Calendar } from "lucide-react";

const NAV_ITEMS = [
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/dna", label: "DNA", icon: Dna },
  { to: "/posts", label: "Posts", icon: FileText },
  { to: "/derivacoes", label: "Derivações", icon: Share2 },
  { to: "/planejamento", label: "Planejamento", icon: LayoutDashboard },
  { to: "/calendario", label: "Calendário", icon: Calendar },
] as const;

export function AppLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <nav
        style={{
          width: 220,
          background: "#111",
          color: "#fff",
          padding: "24px 0",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          flexShrink: 0,
        }}
      >
        <div style={{ padding: "0 20px 20px", fontSize: 14, fontWeight: 700, letterSpacing: 1 }}>
          MOTOR DE CONTEÚDO
        </div>

        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 20px",
              color: isActive ? "#fff" : "#888",
              background: isActive ? "#222" : "transparent",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: isActive ? 600 : 400,
              borderLeft: isActive ? "3px solid #009B4D" : "3px solid transparent",
              transition: "all 0.15s",
            })}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <main style={{ flex: 1, padding: 32, background: "#fafafa", overflowY: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
}
