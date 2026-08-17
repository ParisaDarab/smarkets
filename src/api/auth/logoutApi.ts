import { apiClient } from "../apiClient";
import { apiList } from "../apiList";
export function logout(token: string) {
  return apiClient<{ success: boolean }>(apiList.auth.deleteSession.url, {
    method: apiList.auth.deleteSession.method,
    token,
  });
}