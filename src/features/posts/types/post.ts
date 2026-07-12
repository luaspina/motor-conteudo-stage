/** Matches public.posts table */
export interface Post {
  id: string;
  client_id: string;
  pauta_id: string | null;
  titulo_arte: string | null;
  texto_arte: string | null;
  legenda: string | null;
  cta: string | null;
  hashtags_fixas: string | null;
  hashtags_var: string | null;
  hashtags_locais: string | null;
  obs_design: string | null;
  formato: string | null;
  objetivo: string | null;
  subpilar: string | null;
  data_sugerida: string | null;
  status: "idea" | "approved" | "em_producao" | "finalizado" | "publicado";
  rating: number | null;
  was_edited: boolean;
  edit_chars: number;
  checklist: Record<string, boolean>;
  generated_at: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Fields set when saving a generated post */
export interface PostInsert {
  client_id: string;
  pauta_id?: string | null;
  titulo_arte: string | null;
  texto_arte: string | null;
  legenda: string | null;
  cta: string | null;
  hashtags_fixas: string | null;
  hashtags_var: string | null;
  hashtags_locais: string | null;
  obs_design: string | null;
  formato: string | null;
  objetivo: string | null;
  subpilar: string | null;
  checklist: Record<string, boolean>;
  generated_at: string;
}

/** Fields that can be updated on a saved post */
export type PostUpdate = Partial<PostInsert> & {
  data_sugerida?: string | null;
  status?: Post["status"];
};
