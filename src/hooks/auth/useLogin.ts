import { useMutation } from '@tanstack/react-query';
import { login } from '@/api/auth/login';
import type { LoginRequest } from '@/types/auth';

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),
  });
}