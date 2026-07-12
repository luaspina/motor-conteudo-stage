interface PlaceholderPageProps {
  title: string;
  step: number;
}

export function PlaceholderPage({ title, step }: PlaceholderPageProps) {
  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{title}</h1>
      <p style={{ color: "#666" }}>Etapa {step} — a ser implementada.</p>
    </div>
  );
}
