const joinIds = (ids: string | string[]) =>
  Array.isArray(ids) ? ids.join(',') : ids;

export const apiList = {
  auth: {
    createSession: { method: 'POST', url: '/v3/sessions/' },
    deleteSession: { method: 'DELETE', url: '/v3/sessions/current/' },
  },
  events: {
    getAllEvents: {
      method: 'GET',
      // No params -> root call. parentId -> that event's direct children
      // (walking down the tree). state -> filter by lifecycle, e.g.
      // state: ['live'] skips categories entirely and returns actual
      // live matches directly, since categories are always "upcoming".
      url: (params?: { parentId?: string; state?: string[] }) => {
        const query = new URLSearchParams();
        if (params?.parentId) query.set('parent_id', params.parentId);
        params?.state?.forEach((s) => query.append('state', s));
        const qs = query.toString();
        return `/v3/events/${qs ? `?${qs}` : ''}`;
      },
    },
  },
  markets: {
    method: 'GET',
    url: (eventId: string) => `/v3/events/${eventId}/markets/`,
  },
  contracts: {
    method: 'GET',
    url: (marketIds: string | string[]) =>
      `/v3/markets/${joinIds(marketIds)}/contracts/`,
  },
  quotes: {
    method: 'GET',
    url: (marketIds: string | string[]) =>
      `/v3/markets/${joinIds(marketIds)}/quotes/`,
  },
} as const;