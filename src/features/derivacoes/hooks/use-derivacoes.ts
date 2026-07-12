import { useQuery } from "@tanstack/react-query";
import { derivacoesRepository } from "../api";
import { derivacaoKeys } from "./derivacao-keys";

export function useDerivacoes(postId: string | undefined) {
  return useQuery({
    queryKey: derivacaoKeys.byPost(postId!),
    queryFn: () => derivacoesRepository.listByPost(postId!),
    enabled: !!postId,
  });
}
