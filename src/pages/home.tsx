import { AppHeader } from '@/components/AppHeader';
import { ContractPriceList } from '@/components/ContractPriceList';
import { useEvents } from '@/hooks/events/useEvents';
import { useMarketsForEvents } from '@/hooks/markets/useMarkets';
import { useQuotes } from '@/hooks//quotes/useQuotes';
import { home } from '@/lib/i18n/en';
import { useContractsForMarkets } from '@/hooks/contracts/useContract';
import { useState } from 'react';
import { cn } from '@/shadcn/lib/utils';
import { EventCard } from '@/components/EventCard';
import type { SmarketsMarket } from '@/types/market';
import type { SmarketsEvent } from '@/types/event';
const FEATURED_LIVE_COUNT = 8;
export type FeaturedMarket = { event: SmarketsEvent; market: SmarketsMarket };

export const Home = () => {
  const [selectedSportId, setSelectedSportId] = useState<string | null>(null);

  const sportsQuery = useEvents();
  const sports = (sportsQuery.data?.events ?? []).filter(
    (event) => event.type === 'top_level_event' && !event.hidden
  );
  const selectedSport =
    sports.find((sport) => sport.id === selectedSportId) ?? null;

  const liveQuery = useEvents({ state: ['live'] });
  const allLiveEvents = liveQuery.data?.events ?? [];
  const liveEvents = selectedSport
    ? allLiveEvents.filter((event) =>
        event.full_slug?.startsWith(`/sport/${selectedSport.slug}`)
      )
    : allLiveEvents;
  const visibleLiveEvents = liveEvents.slice(0, FEATURED_LIVE_COUNT);
  const visibleLiveEventIds = visibleLiveEvents.map((event) => event.id);

  const marketsQueries = useMarketsForEvents(visibleLiveEventIds);

  const featuredMarkets: FeaturedMarket[] = [];
  visibleLiveEvents.forEach((event, index) => {
    const market = marketsQueries[index]?.data?.markets?.[0];
    if (market) featuredMarkets.push({ event, market });
  });

  const featuredMarketIds = featuredMarkets.map((fm) => fm.market.id);
  const contractsQueries = useContractsForMarkets(featuredMarketIds);
  const { quotes } = useQuotes(featuredMarketIds);
  return (
    <div className="min-h-screen bg-smarkets-bg ">
      <AppHeader />
      <main className="mx-auto max-w-[80%] px-4 py-6">
        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            {home.liveMarketsTitle}
          </h2>

          {sports.length > 0 && (
            <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setSelectedSportId(null)}
                className={cn(
                  'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  selectedSportId === null
                    ? 'bg-foreground text-background'
                    : 'border border-border bg-white text-foreground hover:border-primary'
                )}
              >
                All
              </button>
              {sports.map((sport) => (
                <button
                  key={sport.id}
                  type="button"
                  onClick={() => setSelectedSportId(sport.id)}
                  className={cn(
                    'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    selectedSportId === sport.id
                      ? 'bg-foreground text-background'
                      : 'border border-border bg-white text-foreground hover:border-primary'
                  )}
                >
                  {sport.name}
                </button>
              ))}
            </div>
          )}

          {liveQuery.isLoading && (
            <p className="text-sm text-muted-foreground">{home.loading}</p>
          )}
          {!liveQuery.isLoading && featuredMarkets.length === 0 && (
            <p className="text-sm text-muted-foreground">{home.liveEmpty}</p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {featuredMarkets.map((fm, index) => {
              const contracts = contractsQueries[index]?.data?.contracts ?? [];
              return (
                <EventCard featuredMarket={fm}>
                  <ContractPriceList
                    marketName={fm.market.name}
                    contracts={contracts}
                    quotes={quotes}
                  />
                </EventCard>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};
