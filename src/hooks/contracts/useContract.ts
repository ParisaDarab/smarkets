import { useQueries } from '@tanstack/react-query';
import { useAuth } from '../useAuth';
import { getContracts } from '@/api/contracts/contractsApi';

/** Contract lists (the runners/outcomes in a market) rarely change once a
 * market opens, unlike prices, so this is fetched once rather than polled. */
export function useContractsForMarkets(marketIds: string[]) {
  const { token } = useAuth();

  return useQueries({
    queries: marketIds.map((marketId) => ({
      queryKey: ['contracts', [marketId]],
      queryFn: () => getContracts(marketId, token as string),
      enabled: Boolean(token),
      staleTime: 60_000,
    })),
  });
}