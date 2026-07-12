import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postsRepository } from "../api";
import { postKeys } from "./post-keys";
import type { PostInsert } from "../types";

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: PostInsert) => postsRepository.create(input),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: postKeys.byClient(created.client_id) });
    },
  });
}
