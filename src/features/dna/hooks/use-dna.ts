import { useQuery } from "@tanstack/react-query";
import { dnaRepository } from "../api";
import { dnaKeys } from "./dna-keys";

export function useDna(clientId: string | undefined) {
  return useQuery({
    queryKey: dnaKeys.byClient(clientId!),
    queryFn: () => dnaRepository.getByClientId(clientId!),
    enabled: !!clientId,
  });
}
