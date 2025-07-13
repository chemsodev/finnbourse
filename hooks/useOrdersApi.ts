import { useMemo } from "react";
import { useRestToken } from "@/hooks/useRestToken";
import createJournalOrdersClient, {
  JournalOrdersApiClient,
} from "@/lib/api/journalOrders/client";

export const useJournalOrdersApi = (): JournalOrdersApiClient => {
  const { restToken } = useRestToken();

  return useMemo(() => createJournalOrdersClient(() => restToken), [restToken]);
};
