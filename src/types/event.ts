/**
 * Confirmed against a real GET /v3/events/ response (not guessed). Events
 * are hierarchical: `type: "top_level_event"` with `parent_id: null` are
 * the sports themselves (Football, Cycling, ...); `type: "generic"` with
 * a non-null `parent_id` are children (competitions, and further down,
 * individual matches) - see getEvents' `parentId` param.
 */
export type SmarketsEvent = {
  id: string;
  name: string;
  slug: string;
  full_slug: string;
  type: string;
  state: string;
  parent_id: string | null;
  start_date: string | null;
  start_datetime: string | null;
  end_date: string | null;
  description: string | null;
  short_name: string | null;
  hidden: boolean;
  bet_allowed: boolean;
  bettable: boolean;
  inplay_enabled: boolean;
  display_order: number;
  venue: string | null;
};

export type EventsResponse = {
  events: SmarketsEvent[];
  /** Ready-made query string to append for the next page, e.g. "?state=upcoming&pagination_last_id=147001". null/absent on the last page. */
  pagination?: { next_page: string | null };
};
