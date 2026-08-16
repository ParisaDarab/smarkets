import { apiClient } from "./apiClient";
import { apiList } from "./apiList";

const {auth}=apiList

import type { LoginRequest, LoginResponse } from "@/types/auth/auth";

export function login(payload: LoginRequest) {
  return apiClient<LoginResponse>(auth.createSession.method, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}