import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../useAuth';
import { logout as logoutApi } from '@/api/auth/logoutApi';


export function useLogout() {
  const { token, logout: clearSession } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (token) {
        try {
          await logoutApi(token);
        } catch {
          // Ignore - we still want to clear the local session below.
        }
      }
    },
    onSettled: () => clearSession(),
  });
}