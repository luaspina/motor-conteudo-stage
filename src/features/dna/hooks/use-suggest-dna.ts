import { useMutation } from "@tanstack/react-query";
import { suggestService } from "../api";

interface ClientInput {
  name: string;
  segment?: string | null;
  instagram?: string | null;
  site?: string | null;
}

interface SuggestIdentidadeParams {
  section: "identidade";
  client: ClientInput;
}

interface SuggestEstiloParams {
  section: "estilo";
  client: ClientInput;
  identidade: { tom_de_voz?: string; publico?: string; objetivos?: string };
}

type SuggestParams = SuggestIdentidadeParams | SuggestEstiloParams;

function callSuggest(params: SuggestParams): Promise<unknown> {
  if (params.section === "identidade") {
    return suggestService.identidade(params.client);
  }
  return suggestService.estilo(params.client, params.identidade);
}

export function useSuggestDna() {
  return useMutation<unknown, Error, SuggestParams>({
    mutationFn: callSuggest,
  });
}
