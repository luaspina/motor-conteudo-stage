/** Matches the pilares JSONB array structure */
export interface Pilar {
  nome: string;
  peso_pct: number;
  subpilares: string[];
}

/** Matches exemplos_aprovados JSONB */
export interface ExemploAprovado {
  titulo: string;
  abertura: string;
  fechamento: string;
  notas?: string;
}

/** Matches exemplos_reprovados JSONB */
export interface ExemploReprovado {
  titulo: string;
  problema: string;
}

/** Matches perfis_referencia JSONB */
export interface PerfilReferencia {
  handle: string;
  notas: string;
}

/** Matches temas_cobertos JSONB */
export interface TemaCoberto {
  tema: string;
  data: string;
  subpilar: string;
  formato?: string;
}

/** Matches public.client_dna table */
export interface ClientDna {
  id: string;
  client_id: string;
  tom_de_voz: string | null;
  publico: string | null;
  objetivos: string | null;
  pilares: Pilar[];
  estilo_legenda: string | null;
  cta_padrao: string | null;
  hashtags_base: string | null;
  palavras_preferidas: string | null;
  palavras_evitar: string | null;
  o_que_nao_fazer: string | null;
  temas_proibidos: string | null;
  regras: string | null;
  exemplos_aprovados: ExemploAprovado[];
  exemplos_reprovados: ExemploReprovado[];
  perfis_referencia: PerfilReferencia[];
  calendario_config: Record<string, unknown>;
  aprendizados: string[];
  historico_feedbacks: Record<string, unknown>[];
  onboarding_sources: Record<string, unknown>;
  temas_cobertos: TemaCoberto[];
  observacoes: string | null;
  updated_at: string;
}

/** Fields the form can update */
export type ClientDnaUpdate = Omit<ClientDna, "id" | "client_id" | "updated_at">;
