import { useMutation, useQueryClient } from "@tanstack/react-query";
import { derivacoesRepository } from "../api";
import { derivacaoKeys } from "./derivacao-keys";
import type { DerivacaoInsert } from "../types";

export function useCreateDerivacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DerivacaoInsert) => derivacoesRepository.create(input),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: derivacaoKeys.byPost(created.post_id) });
    },
  });
}
