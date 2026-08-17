import type { ContractsResponse } from "@/types/contract";
import { apiClient } from "../apiClient";
import { apiList } from "../apiList";

export function getContracts(marketIds: string | string[], token: string) {
  return apiClient<ContractsResponse>(apiList.contracts.url(marketIds), {
    method: apiList.contracts.method,
    token,
  });
}