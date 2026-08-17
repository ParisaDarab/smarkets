import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../useAuth';
import { getEvents } from '@/api/events/eventApi';

type UseEventsParams = {
  /** Fetch this event's direct children instead of the root list (walks down the tree). */
  parentId?: string;
  /** Filter by lifecycle state, e.g. ['live'] to get actual matches directly, skipping categories. */
  state?: string[];
};

export function useEvents(params: UseEventsParams = {}) {
  const { token } = useAuth();
  const { parentId, state } = params;

  return useQuery({
    queryKey: ['events', parentId ?? 'root', state ?? []],
    queryFn: () => getEvents(token as string, { ...params }),
    enabled: Boolean(token),
    staleTime: 30_000,
  });
}