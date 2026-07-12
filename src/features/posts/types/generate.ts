/** What the user fills in to request a post generation */
export interface GeneratePostInput {
  titulo: string;
  pilar: string;
  subpilar: string;
  formato: string;
  objetivo: string;
  resumo: string;
}

/** Shape returned by the Edge Function for prompt_type "post" */
export interface GeneratedPostData {
  titulo_arte: string;
  texto_arte: string;
  legenda: string;
  cta: string;
  hashtags_fixas: string;
  hashtags_var: string;
  hashtags_locais: string;
  obs_design: string;
  formato_sugerido: string;
  objetivo: string;
  subpilar: string;
  checklist: Record<string, boolean>;
}

/** Full Edge Function response envelope */
export interface GenerateResponse {
  success: boolean;
  prompt_type: string;
  data: GeneratedPostData | null;
  raw?: string;
  usage?: { input_tokens: number; output_tokens: number };
}
