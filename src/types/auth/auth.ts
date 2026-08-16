export type LoginRequest = {
  username: string;
  password: string;
  remember?: boolean;
};


export type LoginResponse = {
  token: string | null;
  stop: string | null;
  factor?: 'complete' | 'totp' | 'nemid';
  verify?: boolean;
  refresh_token?: string;
  created_social_member?: boolean;
};