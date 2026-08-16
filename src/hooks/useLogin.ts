import { useMutation } from '@tanstack/react-query';
import { login } from '@/lib/api/authApi';
import type { LoginRequest } from '@/types/auth/auth';

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),
  });
}