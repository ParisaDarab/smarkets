import { Link, useParams } from 'react-router-dom';
import { AppHeader } from '@/components/AppHeader';
import { ContractPriceRow } from '@/components/ContractPriceRow';
import { useMarkets } from '@/hooks/markets/useMarkets';
import { useContractsForMarkets } from '@/hooks/contracts/useContract';
import { useQuotes } from '@/hooks/quotes/useQuotes';
import { event as eventCopy } from '@/lib/i18n/en';

export const Event = () => {
  const { eventId } = useParams<{ eventId: string }>();

  const marketsQuery = useMarkets(eventId);
  const markets = marketsQuery.data?.markets ?? [];
  const marketIds = markets.map((market) => market.id);

  const contractsQueries = useContractsForMarkets(marketIds);
  const { quotes } = useQuotes(marketIds);

  return (
    <div className="min-h-screen bg-smarkets-bg">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <Link
          to="/"
          className="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← {eventCopy.back}
        </Link>

        <h1 className="mb-4 text-xl font-semibold text-foreground">
          {eventCopy.markets}
        </h1>

        {marketsQuery.isLoading && (
          <p className="text-sm text-muted-foreground">{eventCopy.loading}</p>
        )}
        {marketsQuery.isError && (
          <p className="text-sm text-destructive">{eventCopy.error}</p>
        )}
        {!marketsQuery.isLoading &&
          !marketsQuery.isError &&
          markets.length === 0 && (
            <p className="text-sm text-muted-foreground">{eventCopy.empty}</p>
          )}

        <div className="flex flex-col gap-4">
          {markets.map((market, index) => {
            const contracts = contractsQueries[index]?.data?.contracts ?? [];
            return (
              <div
                key={market.id}
                className="rounded-lg border border-border bg-white p-4"
              >
                <p className="mb-3 text-sm font-semibold text-foreground">
                  {market.name}
                </p>
                {contracts.map((contract) => (
                  <ContractPriceRow
                    key={contract.id}
                    name={contract.name}
                    quote={quotes.get(contract.id)}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
