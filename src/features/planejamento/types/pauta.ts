export type PautaPrioridade = "alta" | "media" | "baixa";
export type PautaStatus = "idea" | "approved" | "rejected";

/** Matches public.pautas table */
export interface Pauta {
  id: string;
  client_id: string;
  batch_id: string;
  titulo: string;
  pilar: string | null;
  subpilar: string | null;
  formato: string | null;
  objetivo: string | null;
  resumo: string | null;
  justificativa: string | null;
  prioridade: PautaPrioridade;
  status: PautaStatus;
  source_params: Record<string, unknown>;
  created_at: string;
}

/** Fields for inserting a pauta into the DB */
export interface PautaInsert {
  client_id: string;
  batch_id: string;
  titulo: string;
  pilar?: string;
  subpilar?: string;
  formato?: string;
  objetivo?: string;
  resumo?: string;
  justificativa?: string;
  prioridade?: PautaPrioridade;
  status?: PautaStatus;
  source_params?: Record<string, unknown>;
}

/** Fields that can be updated on a saved pauta */
export interface PautaUpdate {
  titulo?: string;
  resumo?: string;
  status?: PautaStatus;
}
