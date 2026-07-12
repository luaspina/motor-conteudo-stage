import type { Client } from "@/features/clients/types";
import type { ClientDna, Pilar, ExemploAprovado, ExemploReprovado, PerfilReferencia, TemaCoberto } from "@/features/dna/types";

/** Shape of the client object sent to the Edge Function */
export interface EdgeClientPayload {
  name: string;
  segment: string | null;
  instagram: string | null;
  site: string | null;
  whatsapp: string | null;
}

/** Shape of the DNA object sent to the Edge Function */
export interface EdgeDnaPayload {
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
  temas_cobertos: TemaCoberto[];
  aprendizados: string[];
  perfis_referencia: PerfilReferencia[];
  observacoes: string | null;
}

/** Builds the client payload for the Edge Function */
export function buildClientPayload(client: Client): EdgeClientPayload {
  return {
    name: client.name,
    segment: client.segment,
    instagram: client.instagram,
    site: client.site,
    whatsapp: client.whatsapp,
  };
}

/** Builds the DNA payload for the Edge Function */
export function buildDnaPayload(dna: ClientDna): EdgeDnaPayload {
  return {
    tom_de_voz: dna.tom_de_voz,
    publico: dna.publico,
    objetivos: dna.objetivos,
    pilares: dna.pilares,
    estilo_legenda: dna.estilo_legenda,
    cta_padrao: dna.cta_padrao,
    hashtags_base: dna.hashtags_base,
    palavras_preferidas: dna.palavras_preferidas,
    palavras_evitar: dna.palavras_evitar,
    o_que_nao_fazer: dna.o_que_nao_fazer,
    temas_proibidos: dna.temas_proibidos,
    regras: dna.regras,
    exemplos_aprovados: dna.exemplos_aprovados,
    exemplos_reprovados: dna.exemplos_reprovados,
    temas_cobertos: dna.temas_cobertos,
    aprendizados: dna.aprendizados,
    perfis_referencia: dna.perfis_referencia,
    observacoes: dna.observacoes,
  };
}
