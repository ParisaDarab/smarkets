export type ContractQuoteLevel = {
  price: number;
  volume: number;
};

export type ContractQuote = {
  bids: ContractQuoteLevel[];
  offers: ContractQuoteLevel[];
};

export type QuotesResponse = Record<string, ContractQuote>;