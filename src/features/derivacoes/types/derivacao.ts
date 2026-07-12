export const DERIVACAO_TIPOS = ["reels", "story", "linkedin", "facebook"] as const;

export type DerivacaoTipo = (typeof DERIVACAO_TIPOS)[number];

export const DERIVACAO_LABELS: Record<DerivacaoTipo, string> = {
  reels: "Reels",
  story: "Story",
  linkedin: "LinkedIn",
  facebook: "Facebook",
};

/** Matches public.post_derivacoes table */
export interface Derivacao {
  id: string;
  post_id: string;
  tipo: DerivacaoTipo;
  conteudo: string | null;
  created_at: string;
}

export interface DerivacaoInsert {
  post_id: string;
  tipo: DerivacaoTipo;
  conteudo: string;
}
