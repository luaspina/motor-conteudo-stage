import { supabase, buildClientPayload, buildDnaPayload } from "@/shared/lib";
import type { Client } from "@/features/clients/types";
import type { ClientDna } from "@/features/dna/types";
import type { GenerateDerivacaoInput, GenerateDerivacaoResponse } from "../types";

interface GenerateDerivacaoParams {
  client: Client;
  dna: ClientDna;
  input: GenerateDerivacaoInput;
}

export const generateDerivacaoService = {
  async generate({ client, dna, input }: GenerateDerivacaoParams): Promise<GenerateDerivacaoResponse> {
    const { data, error } = await supabase.functions.invoke("generate", {
      body: {
        prompt_type: "derivacao",
        client: buildClientPayload(client),
        dna: buildDnaPayload(dna),
        payload: {
          legenda: input.legenda,
          tipo: input.tipo,
        },
      },
    });

    if (error) throw error;
    return data as GenerateDerivacaoResponse;
  },
};
