import { useQuery } from "@tanstack/react-query";
import { clientsRepository } from "../api";
import { clientKeys } from "./client-keys";

export function useClient(id: string | undefined) {
  return useQuery({
    queryKey: clientKeys.detail(id!),
    queryFn: () => clientsRepository.getById(id!),
    enabled: !!id,
  });
}
