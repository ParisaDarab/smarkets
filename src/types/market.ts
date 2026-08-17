
export type SmarketsMarket = {
  id: string;
  event_id?: string;
  name: string;
  state?: string;
};

export type MarketsResponse = {
  markets: SmarketsMarket[];
};

