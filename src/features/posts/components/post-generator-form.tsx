import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import { Button } from "@/shared/components";
import { generatePostSchema, type GeneratePostFormValues } from "../types";

interface PostGeneratorFormProps {
  onSubmit: (values: GeneratePostFormValues) => void;
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

export function PostGeneratorForm({ onSubmit, isGenerating }: PostGeneratorFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GeneratePostFormValues>({
    resolver: zodResolver(generatePostSchema),
    defaultValues: {
      titulo: "",
      pilar: "",
      subpilar: "",
      formato: "carrossel",
      objetivo: "educativo",
      resumo: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: "flex", flexDirection: "column", gap: 14 }}
    >
      <div>
        <label style={labelStyle}>Título da pauta *</label>
        <input
          {...register("titulo")}
          style={inputStyle}
          placeholder="Ex: 5 direitos que todo trabalhador CLT deveria conhecer"
        />
        {errors.titulo && <p style={errorStyle}>{errors.titulo.message}</p>}
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Pilar</label>
          <input {...register("pilar")} style={inputStyle} placeholder="Ex: Educativo" />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Subpilar</label>
          <input {...register("subpilar")} style={inputStyle} placeholder="Ex: CLT" />
        </div>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Formato *</label>
          <select {...register("formato")} style={{ ...inputStyle, background: "#fff", cursor: "pointer" }}>
            <option value="carrossel">Carrossel</option>
            <option value="feed">Feed (imagem única)</option>
            <option value="reels">Reels</option>
            <option value="story">Story</option>
          </select>
          {errors.formato && <p style={errorStyle}>{errors.formato.message}</p>}
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Objetivo *</label>
          <select {...register("objetivo")} style={{ ...inputStyle, background: "#fff", cursor: "pointer" }}>
            <option value="educativo">Educativo</option>
            <option value="captação">Captação</option>
            <option value="autoridade">Autoridade</option>
            <option value="desejo">Desejo</option>
            <option value="relacionamento">Relacionamento</option>
          </select>
          {errors.objetivo && <p style={errorStyle}>{errors.objetivo.message}</p>}
        </div>
      </div>

      <div>
        <label style={labelStyle}>Resumo da pauta</label>
        <textarea
          {...register("resumo")}
          style={{ ...inputStyle, minHeight: 60, fontFamily: "inherit", resize: "vertical" }}
          placeholder="Contexto adicional para a IA (opcional)"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={isGenerating}
        icon={<Sparkles size={16} />}
        style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
      >
        {isGenerating ? "Gerando..." : "Gerar post com IA"}
      </Button>
    </form>
  );
}
