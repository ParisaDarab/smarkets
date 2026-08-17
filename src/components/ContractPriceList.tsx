import type { ContractQuote } from '@/types/quote';
import { ContractPriceRow } from './ContractPriceRow';
import type { SmarketsContract } from '@/types/contract';

type ContractPriceListProps = {
  marketName: string;
  contracts: SmarketsContract[];
  quotes: Map<string, ContractQuote>;
};

export function ContractPriceList({
  marketName,
  contracts,
  quotes,
}: ContractPriceListProps) {
  return (
    <div>
      <p className="mb-2 text-xs text-muted-foreground">{marketName}</p>

      {contracts.length > 0 && (
        <div className="mb-1 flex items-center justify-end gap-2">
          <span className="w-16 text-center text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            Buy
          </span>
          <span className="w-16 text-center text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            Sell
          </span>
        </div>
      )}

      <div className="flex flex-col divide-y divide-border">
        {contracts.map((contract) => (
          <ContractPriceRow
            key={contract.id}
            name={contract.name}
            quote={quotes.get(contract.id)}
          />
        ))}
      </div>
    </div>
  );
}
