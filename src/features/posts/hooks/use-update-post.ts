import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postsRepository } from "../api";
import { postKeys } from "./post-keys";
import type { PostUpdate } from "../types";

interface Params {
  id: string;
  clientId: string;
  data: PostUpdate;
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: Params) => postsRepository.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.byClient(variables.clientId) });
    },
  });
}
