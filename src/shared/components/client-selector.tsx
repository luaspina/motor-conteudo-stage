import { useClients } from "@/features/clients/hooks";

interface ClientSelectorProps {
  value: string;
  onChange: (clientId: string) => void;
}

export function ClientSelector({ value, onChange }: ClientSelectorProps) {
  const { data: clients, isLoading } = useClients();

  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 13,
          fontWeight: 500,
          color: "#444",
          marginBottom: 4,
        }}
      >
        Cliente
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isLoading}
        style={{
          width: "100%",
          padding: "10px 12px",
          border: "1px solid #ddd",
          borderRadius: 8,
          fontSize: 14,
          background: "#fff",
          cursor: "pointer",
          outline: "none",
        }}
      >
        <option value="">
          {isLoading ? "Carregando..." : "Selecione um cliente"}
        </option>
        {clients?.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} {c.segment ? `— ${c.segment}` : ""}
          </option>
        ))}
      </select>
    </div>
  );
}
