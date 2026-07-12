import type { DerivacaoTipo } from "./derivacao";

export interface GenerateDerivacaoInput {
  legenda: string;
  tipo: DerivacaoTipo;
}

/** Edge Function response for derivacao — data is null, content comes in raw */
export interface GenerateDerivacaoResponse {
  success: boolean;
  prompt_type: string;
  data: null;
  raw: string;
  usage?: { input_tokens: number; output_tokens: number };
}
