import { Link } from 'react-router-dom';
import { AppHeader } from '@/components/AppHeader';
import { ContractPriceList } from '@/components/ContractPriceList';
import { useEvents } from '@/hooks/events/useEvents';
import { useMarketsForEvents } from '@/hooks/markets/useMarkets';
import { useQuotes } from '@/hooks/quotes/useQuotes';
import { home } from '@/lib/i18n/en';
import { useContractsForMarkets } from '@/hooks/contracts/useContract';
import { useEffect, useState } from 'react';
import { cn } from '@/shadcn/lib/utils';
import { EventCard } from '@/components/EventCard';
import type { SmarketsMarket } from '@/types/market';
import type { SmarketsEvent } from '@/types/event';
import { SpinnerCustom } from '@/components/Loading';
import { EmptyList } from '@/components/emptyList';

const FEATURED_LIVE_COUNT = 4;
const LOAD_MORE_BATCH = 8;
const SCROLL_THRESHOLD_PX = 300;

export type FeaturedMarket = { event: SmarketsEvent; market: SmarketsMarket };

export const Home = () => {
  const [selectedSportId, setSelectedSportId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(FEATURED_LIVE_COUNT);

  const sportsQuery = useEvents();
  const sports = (sportsQuery.data?.events ?? []).filter(
    (event) => event.type === 'top_level_event' && !event.hidden
  );
  const selectedSport =
    sports.find((sport) => sport.id === selectedSportId) ?? null;

  const handleSelectSport = (sportId: string | null) => {
    setSelectedSportId(sportId);
    setVisibleCount(FEATURED_LIVE_COUNT); // start fresh, don't carry a big count across filter changes
  };

  const liveQuery = useEvents({ state: ['live'] });
  const allLiveEvents = liveQuery.data?.events ?? [];
  const liveEvents = selectedSport
    ? allLiveEvents.filter((event) =>
        event.full_slug?.startsWith(`/sport/${selectedSport.slug}`)
      )
    : allLiveEvents;
  const visibleLiveEvents = liveEvents.slice(0, visibleCount);
  const visibleLiveEventIds = visibleLiveEvents.map((event) => event.id);

  const marketsQueries = useMarketsForEvents(visibleLiveEventIds);

  const featuredMarkets: FeaturedMarket[] = [];
  visibleLiveEvents.forEach((event, index) => {
    const market = marketsQueries[index]?.data?.markets?.[0];
    if (market) featuredMarkets.push({ event, market });
  });

  const totalLiveCount = liveEvents.length;

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - SCROLL_THRESHOLD_PX;

      if (!nearBottom) return;

      setVisibleCount((previous) => {
        if (previous >= totalLiveCount) return previous; // already showing everything - no-op
        return Math.min(previous + LOAD_MORE_BATCH, totalLiveCount);
      });
    };

    window.addEventListener('scrollend', handleScroll);
    return () => window.removeEventListener('scrollend', handleScroll);
  }, [totalLiveCount]);

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
                onClick={() => handleSelectSport(null)}
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
                  onClick={() => handleSelectSport(sport.id)}
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
            <EmptyList />
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {featuredMarkets.map((fm, index) => {
              const contracts = contractsQueries[index]?.data?.contracts ?? [];
              return (
                <EventCard featuredMarket={fm} key={fm.market.id}>
                  <ContractPriceList
                    marketName={fm.market.name}
                    contracts={contracts}
                    quotes={quotes}
                  />
                </EventCard>
              );
            })}
          </div>

          {visibleCount < totalLiveCount && (
            <SpinnerCustom text={home.loading} />
          )}
        </section>
      </main>
    </div>
  );
};
