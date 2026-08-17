export type ContractQuoteSide = {
  price: number;
  quantity?: number;
};

export type ContractQuote = {
  contract_id?: string;
  /** Best "back" price - the price at which a user could back this contract. */
  bids?: ContractQuoteSide | null;
  /** Best "lay" price - the price at which a user could lay this contract. */
  offers?: ContractQuoteSide | null;
  last_executed_price?: number | null;
};

export type QuotesResponse =
  | { quotes: ContractQuote[] }
  | { quotes: Record<string, ContractQuote> };