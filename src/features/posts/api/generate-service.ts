import { supabase, buildClientPayload, buildDnaPayload } from "@/shared/lib";
import type { Client } from "@/features/clients/types";
import type { ClientDna } from "@/features/dna/types";
import type { GeneratePostInput, GenerateResponse } from "../types";

interface GeneratePostParams {
  client: Client;
  dna: ClientDna;
  pauta: GeneratePostInput;
}

export const generateService = {
  async post({ client, dna, pauta }: GeneratePostParams): Promise<GenerateResponse> {
    const { data, error } = await supabase.functions.invoke("generate", {
      body: {
        prompt_type: "post",
        client: buildClientPayload(client),
        dna: buildDnaPayload(dna),
        payload: {
          titulo: pauta.titulo,
          pilar: pauta.pilar || undefined,
          subpilar: pauta.subpilar || undefined,
          formato: pauta.formato,
          objetivo: pauta.objetivo,
          resumo: pauta.resumo || undefined,
        },
      },
    });

    if (error) throw error;

    const response = data as GenerateResponse;

    if (!response.data) {
      throw new Error(
        "A IA retornou uma resposta em formato inesperado. Tente gerar novamente.",
      );
    }

    return response;
  },
};
