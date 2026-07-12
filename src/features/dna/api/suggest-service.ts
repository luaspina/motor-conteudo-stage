import { supabase } from "@/shared/lib";

interface ClientInput {
  name: string;
  segment?: string | null;
  instagram?: string | null;
  site?: string | null;
}

interface IdentidadeResult {
  tom_de_voz: string;
  publico: string;
  objetivos: string;
}

interface EstiloResult {
  estilo_legenda: string;
  cta_padrao: string;
  hashtags_base: string;
}

async function invoke<T>(
  section: string,
  client: ClientInput,
  extra?: Record<string, unknown>,
): Promise<T> {
  const { data, error } = await supabase.functions.invoke("suggest", {
    body: { section, client, ...extra },
  });

  if (error) throw error;

  if (!data?.data) {
    throw new Error("A IA retornou uma resposta em formato inesperado. Tente novamente.");
  }

  return data.data as T;
}

export const suggestService = {
  identidade: (client: ClientInput) =>
    invoke<IdentidadeResult>("identidade", client),

  estilo: (
    client: ClientInput,
    identidade: { tom_de_voz?: string; publico?: string; objetivos?: string },
  ) =>
    invoke<EstiloResult>("estilo", client, { identidade }),
};
