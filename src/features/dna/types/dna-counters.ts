import type { DnaFormValues } from "./dna-schema";

type SectionKey =
  | "identidade"
  | "pilares"
  | "estilo"
  | "linguagem"
  | "regras"
  | "exemplos_aprovados"
  | "exemplos_reprovados"
  | "perfis_referencia"
  | "temas_cobertos"
  | "aprendizados"
  | "observacoes";

interface FieldCount {
  filled: number;
  total: number;
}

function str(v: string | undefined): boolean {
  return !!v && v.trim().length > 0;
}

export function countSectionFields(
  values: DnaFormValues,
  section: SectionKey,
): FieldCount {
  switch (section) {
    case "identidade":
      return {
        filled: [values.tom_de_voz, values.publico, values.objetivos].filter(str).length,
        total: 3,
      };
    case "pilares":
      return { filled: values.pilares.length, total: values.pilares.length || 0 };
    case "estilo":
      return {
        filled: [values.estilo_legenda, values.cta_padrao, values.hashtags_base].filter(str).length,
        total: 3,
      };
    case "linguagem":
      return {
        filled: [
          values.palavras_preferidas,
          values.palavras_evitar,
          values.o_que_nao_fazer,
          values.temas_proibidos,
        ].filter(str).length,
        total: 4,
      };
    case "regras":
      return { filled: str(values.regras) ? 1 : 0, total: 1 };
    case "exemplos_aprovados":
      return { filled: values.exemplos_aprovados.length, total: values.exemplos_aprovados.length || 0 };
    case "exemplos_reprovados":
      return { filled: values.exemplos_reprovados.length, total: values.exemplos_reprovados.length || 0 };
    case "perfis_referencia":
      return { filled: values.perfis_referencia.length, total: values.perfis_referencia.length || 0 };
    case "temas_cobertos":
      return { filled: values.temas_cobertos.length, total: values.temas_cobertos.length || 0 };
    case "aprendizados":
      return { filled: values.aprendizados.filter((a) => str(a.value)).length, total: values.aprendizados.length || 0 };
    case "observacoes":
      return { filled: str(values.observacoes) ? 1 : 0, total: 1 };
  }
}

/** Returns sum of all pilar weights */
export function sumPilarWeights(values: DnaFormValues): number {
  return values.pilares.reduce((acc, p) => acc + (p.peso_pct || 0), 0);
}
