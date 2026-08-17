// Grouped by feature/page, with an `errors` sub-namespace inside each page
// to separate UI copy from error copy. `as const` gives literal string
// types so a typo in a key is a compile error, not a silent "undefined".
const en = {
  common: {
    appName: 'Smarkets',
    loading: 'Loading…',
    logOut: 'Log out',
  },
  buttons: {
    continue: 'Continue',
  },
  // Generic field-level defaults, shared by CustomInput across whichever
  // form it's used in - separate from page-specific copy like `login`.
  inputs: {
    emailPlaceholder: 'name@example.com',
    passwordPlaceholder: '••••••••',
  },
  login: {
    title: 'Sign in to Smarkets',
    formTitle: 'Log in',
    subtitle: 'Use your Smarkets account to view live exchange data.',
    emailLabel: 'Email',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••••',
    submit: 'Sign in',
    submitting: 'Signing in…',
    noAccount: "Don't have an account?",
    createAccount: 'Create one on Smarkets',
    errors: {
      invalidCredentials: 'Incorrect email or password.',
      missingToken: 'Login did not return a session token. Please try again.',
      mfaNotSupported:
        'This account has two-factor authentication enabled, which this demo does not support yet. Please use an account without MFA.',
      generic: 'Something went wrong logging in.',
    },
  },
  home: {
    title: 'Sports',
    liveMarketsTitle: 'Live now',
    loading: 'Loading sports…',
    error: 'Could not load sports.',
    empty: 'No sports available right now.',
    liveEmpty: 'Nothing is live right now - check back later.',
    browse: 'Browse',
  },
  event: {
    back: 'Back',
    markets: 'Markets',
    loading: 'Loading…',
    error: 'Could not load this page.',
    empty: 'Nothing available here yet.',
    browse: 'Browse',
  },
} as const;

// Named exports so a component can pull in just the section it needs:
// `import { login } from '@/lib/i18n/en'`
export const { common, buttons, inputs, login, home, event } = en;

export default en;