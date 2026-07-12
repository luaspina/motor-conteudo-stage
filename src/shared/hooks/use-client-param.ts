import { useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useClient } from "@/features/clients/hooks";

/**
 * Source of truth for client selection across features.
 * Reads clientId from ?clientId=xxx, writes back on change.
 * Returns the client object so consumers don't need a separate fetch.
 */
export function useClientParam() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const clientId = searchParams.get("clientId") ?? "";

  const { data: client } = useClient(clientId || undefined);

  const setClientId = useCallback(
    (id: string) => {
      if (id) {
        navigate(`?clientId=${id}`, { replace: true });
      } else {
        navigate("", { replace: true });
      }
    },
    [navigate],
  );

  return { clientId, client, setClientId };
}
