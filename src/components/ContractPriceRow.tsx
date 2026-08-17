import type { ContractQuote } from '@/types/quote';
import PriceCell from './PriceCell';

type ContractPriceRowProps = {
  name: string;
  quote: ContractQuote | undefined;
};

/** One contract (runner/outcome) with its current back/lay prices - the exchange-ladder pattern. */
export function ContractPriceRow({ name, quote }: ContractPriceRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="truncate text-sm text-foreground">{name}</span>
      <div className="flex shrink-0 gap-2">
        <PriceCell side={quote?.bids} tone="buy" />
        <PriceCell side={quote?.offers} tone="sell" />
      </div>
    </div>
  );
}
