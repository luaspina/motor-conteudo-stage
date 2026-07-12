import { supabase } from "@/shared/lib";
import type { ClientDna } from "../types";
import type { DnaFormValues } from "../types";

const TABLE = "client_dna";

/** Converts form values to the shape the DB expects */
function formToDb(values: DnaFormValues) {
  return {
    tom_de_voz: values.tom_de_voz || null,
    publico: values.publico || null,
    objetivos: values.objetivos || null,
    pilares: values.pilares,
    estilo_legenda: values.estilo_legenda || null,
    cta_padrao: values.cta_padrao || null,
    hashtags_base: values.hashtags_base || null,
    palavras_preferidas: values.palavras_preferidas || null,
    palavras_evitar: values.palavras_evitar || null,
    o_que_nao_fazer: values.o_que_nao_fazer || null,
    temas_proibidos: values.temas_proibidos || null,
    regras: values.regras || null,
    exemplos_aprovados: values.exemplos_aprovados,
    exemplos_reprovados: values.exemplos_reprovados,
    perfis_referencia: values.perfis_referencia,
    temas_cobertos: values.temas_cobertos,
    aprendizados: values.aprendizados.map((a) => a.value).filter(Boolean),
    observacoes: values.observacoes || null,
  };
}

/** Converts DB row to form values */
function dbToForm(dna: ClientDna): DnaFormValues {
  return {
    tom_de_voz: dna.tom_de_voz ?? "",
    publico: dna.publico ?? "",
    objetivos: dna.objetivos ?? "",
    pilares: dna.pilares,
    estilo_legenda: dna.estilo_legenda ?? "",
    cta_padrao: dna.cta_padrao ?? "",
    hashtags_base: dna.hashtags_base ?? "",
    palavras_preferidas: dna.palavras_preferidas ?? "",
    palavras_evitar: dna.palavras_evitar ?? "",
    o_que_nao_fazer: dna.o_que_nao_fazer ?? "",
    temas_proibidos: dna.temas_proibidos ?? "",
    regras: dna.regras ?? "",
    exemplos_aprovados: dna.exemplos_aprovados.map((e) => ({
      titulo: e.titulo,
      abertura: e.abertura,
      fechamento: e.fechamento,
      notas: e.notas ?? "",
    })),
    exemplos_reprovados: dna.exemplos_reprovados,
    perfis_referencia: dna.perfis_referencia,
    temas_cobertos: dna.temas_cobertos.map((t) => ({
      tema: t.tema,
      data: t.data,
      subpilar: t.subpilar,
      formato: t.formato ?? "",
    })),
    aprendizados: dna.aprendizados.map((a) => ({ value: a })),
    observacoes: dna.observacoes ?? "",
  };
}

export const dnaRepository = {
  async getByClientId(clientId: string): Promise<ClientDna | null> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("client_id", clientId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async upsert(clientId: string, values: DnaFormValues): Promise<ClientDna> {
    const dbValues = formToDb(values);

    // Try update first
    const { data: existing } = await supabase
      .from(TABLE)
      .select("id")
      .eq("client_id", clientId)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from(TABLE)
        .update(dbValues)
        .eq("client_id", clientId)
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    // Insert if no DNA exists yet
    const { data, error } = await supabase
      .from(TABLE)
      .insert({ client_id: clientId, ...dbValues })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /** Converts a DB record to form-ready values */
  toFormValues: dbToForm,
};
