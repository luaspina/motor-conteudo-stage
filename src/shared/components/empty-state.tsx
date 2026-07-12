import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "64px 24px",
        color: "#666",
      }}
    >
      {icon && <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.4 }}>{icon}</div>}
      <h3 style={{ fontSize: 16, fontWeight: 600, color: "#333", marginBottom: 8 }}>{title}</h3>
      {description && <p style={{ fontSize: 14, marginBottom: 20 }}>{description}</p>}
      {action}
    </div>
  );
}
