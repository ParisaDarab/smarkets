import type { QuotesResponse } from "@/types/quote";
import { apiClient } from "../apiClient";
import { apiList } from "../apiList";



export function getQuotes(marketIds: string | string[], token: string) {
  return apiClient<QuotesResponse>(apiList.quotes.url(marketIds), {
    method: apiList.quotes.method,
    token,
  });
}