import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientsRepository } from "../api";
import { clientKeys } from "./client-keys";
import type { ClientInsert } from "../types";

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ClientInsert) => clientsRepository.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.all });
    },
  });
}
