import { z } from "zod";

const pilarSchema = z.object({
  nome: z.string().min(1, "Nome do pilar é obrigatório"),
  peso_pct: z.number().min(0).max(100),
  subpilares: z.array(z.string()),
});

const exemploAprovadoSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  abertura: z.string(),
  fechamento: z.string(),
  notas: z.string(),
});

const exemploReprovadoSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  problema: z.string(),
});

const perfilReferenciaSchema = z.object({
  handle: z.string().min(1, "Handle é obrigatório"),
  notas: z.string(),
});

const temaCobertoSchema = z.object({
  tema: z.string().min(1, "Tema é obrigatório"),
  data: z.string(),
  subpilar: z.string(),
  formato: z.string(),
});

export const dnaFormSchema = z.object({
  // Identidade
  tom_de_voz: z.string(),
  publico: z.string(),
  objetivos: z.string(),

  // Pilares
  pilares: z.array(pilarSchema),

  // Estilo
  estilo_legenda: z.string(),
  cta_padrao: z.string(),
  hashtags_base: z.string(),

  // Linguagem
  palavras_preferidas: z.string(),
  palavras_evitar: z.string(),
  o_que_nao_fazer: z.string(),
  temas_proibidos: z.string(),

  // Regras
  regras: z.string(),

  // Exemplos
  exemplos_aprovados: z.array(exemploAprovadoSchema),
  exemplos_reprovados: z.array(exemploReprovadoSchema),

  // Referências
  perfis_referencia: z.array(perfilReferenciaSchema),

  // Inteligência editorial
  temas_cobertos: z.array(temaCobertoSchema),
  aprendizados: z.array(z.object({ value: z.string() })),

  // Observações
  observacoes: z.string(),
});

export type DnaFormValues = z.infer<typeof dnaFormSchema>;

/** Default empty values for creating a new DNA */
export function emptyDnaFormValues(): DnaFormValues {
  return {
    tom_de_voz: "",
    publico: "",
    objetivos: "",
    pilares: [],
    estilo_legenda: "",
    cta_padrao: "",
    hashtags_base: "",
    palavras_preferidas: "",
    palavras_evitar: "",
    o_que_nao_fazer: "",
    temas_proibidos: "",
    regras: "",
    exemplos_aprovados: [],
    exemplos_reprovados: [],
    perfis_referencia: [],
    temas_cobertos: [],
    aprendizados: [],
    observacoes: "",
  };
}
