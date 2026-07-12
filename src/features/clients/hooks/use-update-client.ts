import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientsRepository } from "../api";
import { clientKeys } from "./client-keys";
import type { ClientUpdate } from "../types";

interface UpdateClientParams {
  id: string;
  data: ClientUpdate;
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateClientParams) => clientsRepository.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.all });
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(updated.id) });
    },
  });
}
