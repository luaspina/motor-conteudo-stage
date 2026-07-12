import { useQuery } from "@tanstack/react-query";
import { postsRepository } from "../api";
import { postKeys } from "./post-keys";

export function usePosts(clientId: string | undefined) {
  return useQuery({
    queryKey: postKeys.byClient(clientId!),
    queryFn: () => postsRepository.listByClient(clientId!),
    enabled: !!clientId,
  });
}
