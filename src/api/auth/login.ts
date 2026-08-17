import { apiClient } from "../apiClient";
import { apiList } from "../apiList";

const {auth}=apiList

import type { LoginRequest, LoginResponse } from "@/types/auth";


export function login(payload: LoginRequest) {
  return apiClient<LoginResponse>(auth.createSession.url, {
    method: "POST",
    body: JSON.stringify({...payload}),
  });
}