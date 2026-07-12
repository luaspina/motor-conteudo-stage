import { z } from "zod";

export const planejamentoFormSchema = z.object({
  tema: z.string().min(1, "Tema é obrigatório"),
  quantidade: z.number().min(1).max(20),
  periodo: z.string().min(1, "Período é obrigatório"),
  formatos: z.string().min(1, "Formatos são obrigatórios"),
  objetivo: z.string().min(1, "Objetivo é obrigatório"),
});

export type PlanejamentoFormValues = z.infer<typeof planejamentoFormSchema>;
