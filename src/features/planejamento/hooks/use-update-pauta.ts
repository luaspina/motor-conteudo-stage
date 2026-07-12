import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pautasRepository } from "../api";
import { pautaKeys } from "./pauta-keys";
import type { PautaUpdate } from "../types";

interface Params {
  id: string;
  clientId: string;
  data: PautaUpdate;
}

export function useUpdatePauta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: Params) => pautasRepository.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: pautaKeys.byClient(variables.clientId) });
    },
  });
}
