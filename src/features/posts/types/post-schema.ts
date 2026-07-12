import { z } from "zod";

export const generatePostSchema = z.object({
  titulo: z.string().min(1, "Título da pauta é obrigatório"),
  pilar: z.string(),
  subpilar: z.string(),
  formato: z.string().min(1, "Formato é obrigatório"),
  objetivo: z.string().min(1, "Objetivo é obrigatório"),
  resumo: z.string(),
});

export type GeneratePostFormValues = z.infer<typeof generatePostSchema>;
