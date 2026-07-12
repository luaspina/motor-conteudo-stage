import { useMutation } from "@tanstack/react-query";
import { generatePautasService } from "../api";
import type { Client } from "@/features/clients/types";
import type { ClientDna } from "@/features/dna/types";
import type { GeneratePautasInput } from "../types";

interface Params {
  client: Client;
  dna: ClientDna;
  input: GeneratePautasInput;
}

export function useGeneratePautas() {
  return useMutation({
    mutationFn: (params: Params) => generatePautasService.generate(params),
  });
}
