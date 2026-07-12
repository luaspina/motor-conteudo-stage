import type { PautaPrioridade } from "./pauta";

/** What the user fills in to request pauta generation */
export interface GeneratePautasInput {
  tema: string;
  quantidade: number;
  periodo: string;
  formatos: string;
  objetivo: string;
}

/** Single pauta as returned by the Edge Function P1 */
export interface GeneratedPauta {
  titulo: string;
  pilar: string;
  subpilar: string;
  formato_recomendado: string;
  objetivo: string;
  resumo: string;
  justificativa: string;
  prioridade: PautaPrioridade;
}

/** Edge Function response envelope for pautas */
export interface GeneratePautasResponse {
  success: boolean;
  prompt_type: string;
  data: GeneratedPauta[] | null;
  raw?: string;
  usage?: { input_tokens: number; output_tokens: number };
}
