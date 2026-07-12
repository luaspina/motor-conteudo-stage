import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components";
import { clientFormSchema, type ClientFormValues } from "../types";
import type { Client } from "../types";

interface ClientFormProps {
  client?: Client;
  onSubmit: (values: ClientFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const fieldStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #ddd",
  borderRadius: 8,
  fontSize: 14,
  outline: "none",
  transition: "border-color 0.15s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: "#444",
  marginBottom: 4,
};

const errorStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#d32f2f",
  marginTop: 4,
};

export function ClientForm({ client, onSubmit, onCancel, isSubmitting }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: client?.name ?? "",
      segment: client?.segment ?? "",
      instagram: client?.instagram ?? "",
      site: client?.site ?? "",
      whatsapp: client?.whatsapp ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label style={labelStyle}>Nome *</label>
        <input {...register("name")} style={fieldStyle} placeholder="Nome do cliente" />
        {errors.name && <p style={errorStyle}>{errors.name.message}</p>}
      </div>

      <div>
        <label style={labelStyle}>Segmento</label>
        <input {...register("segment")} style={fieldStyle} placeholder="Ex: Advocacia trabalhista" />
      </div>

      <div>
        <label style={labelStyle}>Instagram</label>
        <input {...register("instagram")} style={fieldStyle} placeholder="@perfil" />
      </div>

      <div>
        <label style={labelStyle}>Site</label>
        <input {...register("site")} style={fieldStyle} placeholder="https://..." />
      </div>

      <div>
        <label style={labelStyle}>WhatsApp</label>
        <input {...register("whatsapp")} style={fieldStyle} placeholder="(11) 99999-9999" />
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
        <Button type="button" variant="neutral" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : client ? "Atualizar" : "Criar cliente"}
        </Button>
      </div>
    </form>
  );
}
