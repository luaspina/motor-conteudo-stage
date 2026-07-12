import { useMutation } from "@tanstack/react-query";
import { generateDerivacaoService } from "../api";
import type { Client } from "@/features/clients/types";
import type { ClientDna } from "@/features/dna/types";
import type { GenerateDerivacaoInput } from "../types";

interface Params {
  client: Client;
  dna: ClientDna;
  input: GenerateDerivacaoInput;
}

export function useGenerateDerivacao() {
  return useMutation({
    mutationFn: (params: Params) => generateDerivacaoService.generate(params),
  });
}
