import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import { planejamentoFormSchema, type PlanejamentoFormValues } from "../types";

interface PlanningFormProps {
  onSubmit: (values: PlanejamentoFormValues) => void;
  isGenerating: boolean;
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: "#444",
  marginBottom: 4,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #ddd",
  borderRadius: 8,
  fontSize: 14,
  outline: "none",
};

const errorStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#d32f2f",
  marginTop: 4,
};

export function PlanningForm({ onSubmit, isGenerating }: PlanningFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlanejamentoFormValues>({
    resolver: zodResolver(planejamentoFormSchema),
    defaultValues: {
      tema: "",
      quantidade: 8,
      periodo: "próximo mês",
      formatos: "feed e carrossel",
      objetivo: "educativo + captação",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: "flex", flexDirection: "column", gap: 14 }}
    >
      <div>
        <label style={labelStyle}>Tema / Objetivo *</label>
        <input
          {...register("tema")}
          style={inputStyle}
          placeholder="Ex: direitos trabalhistas, rescisão, FGTS"
        />
        {errors.tema && <p style={errorStyle}>{errors.tema.message}</p>}
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ width: 120 }}>
          <label style={labelStyle}>Quantidade</label>
          <input
            type="number"
            {...register("quantidade", { valueAsNumber: true })}
            style={{ ...inputStyle, textAlign: "center" }}
            min={1}
            max={20}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Período *</label>
          <input {...register("periodo")} style={inputStyle} placeholder="Ex: julho 2026" />
          {errors.periodo && <p style={errorStyle}>{errors.periodo.message}</p>}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Formatos *</label>
          <input {...register("formatos")} style={inputStyle} placeholder="feed e carrossel" />
          {errors.formatos && <p style={errorStyle}>{errors.formatos.message}</p>}
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Objetivo *</label>
          <input {...register("objetivo")} style={inputStyle} placeholder="educativo + captação" />
          {errors.objetivo && <p style={errorStyle}>{errors.objetivo.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isGenerating}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "12px 24px",
          border: "none",
          borderRadius: 8,
          background: isGenerating ? "#666" : "#111",
          color: "#fff",
          cursor: isGenerating ? "not-allowed" : "pointer",
          fontSize: 14,
          fontWeight: 600,
          marginTop: 4,
        }}
      >
        <Sparkles size={16} />
        {isGenerating ? "Gerando pautas..." : "Gerar pautas com IA"}
      </button>
    </form>
  );
}
