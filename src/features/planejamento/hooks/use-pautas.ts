import { useQuery } from "@tanstack/react-query";
import { pautasRepository } from "../api";
import { pautaKeys } from "./pauta-keys";

export function usePautas(clientId: string | undefined) {
  return useQuery({
    queryKey: pautaKeys.byClient(clientId!),
    queryFn: () => pautasRepository.listByClient(clientId!),
    enabled: !!clientId,
  });
}
