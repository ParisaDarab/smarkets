import { useQueries, useQuery } from '@tanstack/react-query';
import { useAuth } from '../useAuth';
import { getMarkets } from '@/api/markets/marketsApi';

export function useMarkets(eventId: string | undefined) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['markets', eventId],
    queryFn: () => getMarkets(eventId as string, token as string),
    enabled: Boolean(token) && Boolean(eventId),
    staleTime: 30_000,
  });
}

export function useMarketsForEvents(eventIds: string[]) {
  const { token } = useAuth();

  return useQueries({
    queries: eventIds.map((eventId) => ({
      queryKey: ['markets', eventId],
      queryFn: () => getMarkets(eventId, token as string),
      enabled: Boolean(token),
      staleTime: 30_000,
    })),
  });
}
