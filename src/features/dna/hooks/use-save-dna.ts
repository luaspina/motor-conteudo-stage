import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dnaRepository } from "../api";
import { dnaKeys } from "./dna-keys";
import type { DnaFormValues } from "../types";

interface SaveDnaParams {
  clientId: string;
  values: DnaFormValues;
}

export function useSaveDna() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clientId, values }: SaveDnaParams) => dnaRepository.upsert(clientId, values),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: dnaKeys.byClient(data.client_id) });
    },
  });
}
