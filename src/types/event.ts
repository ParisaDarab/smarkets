export type SmarketsEvent = {
  id: string;
  name: string;
  slug?: string;
  full_slug?: string;
  created?:string;
  type?: string;
  state: string;
  parent_id?: string | null;
  start_date?: string | null;
  start_datetime?: string | null;
  end_date?: string | null;
  description?: string | null;
  short_name?: string | null;
  hidden?: boolean;
  bet_allowed?: boolean;
  bettable?: boolean;
  inplay_enabled?: boolean;
  display_order?: number;
  venue?: string | null;
};

export type EventsResponse = {
  events: SmarketsEvent[];
  pagination?: { next_page: string | null };
};
