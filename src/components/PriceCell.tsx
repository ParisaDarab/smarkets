import { formatDecimalOdds } from '@/lib/quotes';
import { cn } from '@/shadcn/lib/utils';
import type { ContractQuoteSide } from '@/types/quote';
type PriceCellProps = {
  side: ContractQuoteSide | null | undefined;
  tone: 'buy' | 'sell';
};

export default function PriceCell({ side, tone }: PriceCellProps) {
  return (
    <span
      className={cn(
        'flex w-16 items-center justify-center rounded-md py-1.5 text-sm font-semibold tabular-nums',
        tone === 'buy'
          ? 'bg-sky-50 text-sky-900 dark:bg-sky-950/40 dark:text-sky-200'
          : 'bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200'
      )}
    >
      {formatDecimalOdds(side?.price)}
    </span>
  );
}
