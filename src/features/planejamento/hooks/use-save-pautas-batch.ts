import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pautasRepository } from "../api";
import { pautaKeys } from "./pauta-keys";
import type { PautaInsert } from "../types";

export function useSavePautasBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pautas: PautaInsert[]) => pautasRepository.createBatch(pautas),
    onSuccess: (saved) => {
      const clientId = saved[0]?.client_id;
      if (clientId) {
        queryClient.invalidateQueries({ queryKey: pautaKeys.byClient(clientId) });
      }
    },
  });
}
