import { headers } from "@/contexts/authProvider"
import { apiClient } from "../apiClient"
import { apiList } from "../apiList"
import type { EventsResponse } from "@/types/event"
export function getEvents(
  token: string,
  params?: { parentId?: string; state?: string[] }
) {
  return apiClient<EventsResponse>(apiList.events.getAllEvents.url(params), {
    method: apiList.events.getAllEvents.method,
    token,
  });
}
