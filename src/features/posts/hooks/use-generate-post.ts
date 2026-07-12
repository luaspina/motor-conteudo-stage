import { useMutation } from "@tanstack/react-query";
import { generateService } from "../api";
import type { Client } from "@/features/clients/types";
import type { ClientDna } from "@/features/dna/types";
import type { GeneratePostInput } from "../types";

interface GenerateParams {
  client: Client;
  dna: ClientDna;
  pauta: GeneratePostInput;
}

export function useGeneratePost() {
  return useMutation({
    mutationFn: (params: GenerateParams) => generateService.post(params),
  });
}
