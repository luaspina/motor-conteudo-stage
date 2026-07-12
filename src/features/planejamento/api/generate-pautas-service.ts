import { supabase, buildClientPayload, buildDnaPayload } from "@/shared/lib";
import type { Client } from "@/features/clients/types";
import type { ClientDna } from "@/features/dna/types";
import type { GeneratePautasInput, GeneratePautasResponse } from "../types";

interface GeneratePautasParams {
  client: Client;
  dna: ClientDna;
  input: GeneratePautasInput;
}

export const generatePautasService = {
  async generate({ client, dna, input }: GeneratePautasParams): Promise<GeneratePautasResponse> {
    const { data, error } = await supabase.functions.invoke("generate", {
      body: {
        prompt_type: "pautas",
        client: buildClientPayload(client),
        dna: buildDnaPayload(dna),
        payload: {
          tema: input.tema,
          quantidade: input.quantidade,
          periodo: input.periodo,
          formatos: input.formatos,
          objetivo: input.objetivo,
        },
      },
    });

    if (error) throw error;

    const response = data as GeneratePautasResponse;

    if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
      throw new Error(
        "A IA retornou uma resposta em formato inesperado. Tente gerar novamente.",
      );
    }

    return response;
  },
};
