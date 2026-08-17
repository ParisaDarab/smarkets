import { apiClient } from '../apiClient';
import { apiList } from '../apiList';
import type {

  MarketsResponse,


} from '@/types/market';


export function getMarkets(eventId: string, token: string) {
  return apiClient<MarketsResponse>(apiList.markets.url(eventId), {
    method: apiList.markets.method,
    token,
  });
}

