import { useQuery } from "@tanstack/react-query";
import { clientsRepository } from "../api";
import { clientKeys } from "./client-keys";

export function useClients() {
  return useQuery({
    queryKey: clientKeys.all,
    queryFn: clientsRepository.list,
  });
}
