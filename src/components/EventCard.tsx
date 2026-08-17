import type { FeaturedMarket } from '@/pages/home';
import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
type EventCardProps = {
  featuredMarket: FeaturedMarket;
  children: ReactNode;
};
export const EventCard = ({ featuredMarket, children }: EventCardProps) => {
  return (
    <Link
      key={featuredMarket.market.id}
      to={`/event/${featuredMarket.event.id}`}
      className="block rounded-xl border-2 border-border bg-white p-4 transition-colors hover:border-smarketsGreen"
    >
      <div className="mb-1 flex items-start justify-between gap-2">
        <p className="text-base font-semibold text-foreground">
          {featuredMarket.event.name}
        </p>
        {featuredMarket.event.state === 'live' && (
          <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium tracking-wide text-emerald-700 uppercase dark:bg-emerald-950/40 dark:text-emerald-300">
            In-Play
          </span>
        )}
      </div>
      {children}
    </Link>
  );
};
