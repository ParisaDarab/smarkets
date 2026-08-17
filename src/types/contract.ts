export type SmarketsContract = {
  id: string;
  market_id?: string;
  name: string;
};

export type ContractsResponse = {
  contracts: SmarketsContract[];
};


