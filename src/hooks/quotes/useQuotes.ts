import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../useAuth';
import { getQuotes } from '@/api/quotes/quotes';
import { normalizeQuotes } from '@/lib/quotes';

const POLL_INTERVAL_MS = 4000;

export function useQuotes(marketIds: string[]) {
  const { token } = useAuth();

  const query = useQuery({
    queryKey: ['quotes', marketIds],
    queryFn: () => getQuotes(marketIds, token as string),
    enabled: Boolean(token) && marketIds.length > 0,
    refetchInterval: POLL_INTERVAL_MS,
    refetchIntervalInBackground: false,
  });

  return { ...query, quotes: normalizeQuotes(query.data) };
}