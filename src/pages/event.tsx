// import { Link, useParams } from 'react-router-dom';
// import { AppHeader } from '@/components/AppHeader';
// import { ContractPriceRow } from '@/components/ContractPriceRow';
// import { useMarkets } from '@/hooks/markets/useMarkets';
// import { useContractsForMarkets } from '@/hooks/contracts/useContract';
// import { useQuotes } from '@/hooks/quotes/useQuotes';
// import { event as eventCopy } from '@/lib/i18n/en';

// export const Event = () => {
//   const { eventId } = useParams<{ eventId: string }>();

//   const marketsQuery = useMarkets(eventId);
//   const markets = marketsQuery.data?.markets ?? [];
//   const marketIds = markets.map((market) => market.id);

//   const contractsQueries = useContractsForMarkets(marketIds);
//   const { quotes } = useQuotes(marketIds);

//   return (
//     <div className="min-h-screen bg-smarkets-bg">
//       <AppHeader />
//       <main className="mx-auto max-w-3xl px-4 py-6">
//         <Link
//           to="/"
//           className="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground"
//         >
//           ← {eventCopy.back}
//         </Link>

//         <h1 className="mb-4 text-xl font-semibold text-foreground">
//           {eventCopy.markets}
//         </h1>

//         {marketsQuery.isLoading && (
//           <p className="text-sm text-muted-foreground">{eventCopy.loading}</p>
//         )}
//         {marketsQuery.isError && (
//           <p className="text-sm text-destructive">{eventCopy.error}</p>
//         )}
//         {!marketsQuery.isLoading &&
//           !marketsQuery.isError &&
//           markets.length === 0 && (
//             <p className="text-sm text-muted-foreground">{eventCopy.empty}</p>
//           )}

//         <div className="flex flex-col gap-4">
//           {markets.map((market, index) => {
//             const contracts = contractsQueries[index]?.data?.contracts ?? [];
//             console.log(market);
//             return (
//               <div
//                 key={market.id}
//                 className="rounded-lg border border-border bg-white p-4"
//               >
//                 <p className="mb-3 text-sm font-semibold text-foreground">
//                   {market.name}
//                 </p>
//                 {contracts.map((contract) => (
//                   <ContractPriceRow
//                     key={contract.id}
//                     name={contract.name}
//                     quote={quotes.get(contract.id)}
//                   />
//                 ))}
//               </div>
//             );
//           })}
//         </div>
//       </main>
//     </div>
//   );
// };
import { Link, useParams } from 'react-router-dom';
import { useMemo } from 'react';

import { AppHeader } from '@/components/AppHeader';
import { ContractPriceRow } from '@/components/ContractPriceRow';

import { useEvents } from '@/hooks/events/useEvents';
import { useMarkets } from '@/hooks/markets/useMarkets';
import { useContractsForMarkets } from '@/hooks/contracts/useContract';
import { useQuotes } from '@/hooks/quotes/useQuotes';

import { event as eventCopy } from '@/lib/i18n/en';

export const Event = () => {
  const { eventId } = useParams<{ eventId: string }>();

  const eventQuery = useEvents({
    state: ['live'],
  });

  const event = useMemo(
    () => eventQuery.data?.events.find((item) => item.id === eventId),
    [eventQuery.data?.events, eventId]
  );

  const marketsQuery = useMarkets(eventId);

  const markets = marketsQuery.data?.markets ?? [];

  const marketIds = markets.map((market) => market.id);

  const contractsQueries = useContractsForMarkets(marketIds);

  const { quotes } = useQuotes(marketIds);

  const formatDate = (value: string | null | undefined) => {
    if (!value) return 'Time not available';

    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(new Date(value));
  };

  return (
    <div className="min-h-screen bg-smarkets-bg">
      <AppHeader />

      <main className="mx-auto max-w-3xl px-4 py-6">
        <Link
          to="/"
          className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← {eventCopy.back}
        </Link>

        {eventQuery.isLoading && (
          <p className="mb-6 text-sm text-muted-foreground">Loading event...</p>
        )}

        {eventQuery.isError && (
          <p className="mb-6 text-sm text-destructive">
            Failed to load event details.
          </p>
        )}

        {event && (
          <section className="mb-6 rounded-lg border border-border bg-white p-5">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold text-foreground">
                {event.name}
              </h1>

              {event.start_datetime && (
                <p className="text-sm text-muted-foreground">
                  {formatDate(event.start_datetime)}
                </p>
              )}

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  Status:
                </span>

                <span
                  className={
                    event.state === 'live'
                      ? 'text-sm font-semibold text-red-600'
                      : 'text-sm font-medium text-muted-foreground'
                  }
                >
                  {event.state === 'live' ? 'In Play' : 'Upcoming'}
                </span>
              </div>
            </div>
          </section>
        )}

        <h2 className="mb-4 text-xl font-semibold text-foreground">
          {eventCopy.markets}
        </h2>

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
