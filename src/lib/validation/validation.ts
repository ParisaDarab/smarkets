// Kept as separate small regexes per rule (rather than one combined
// pattern) so validation errors can say exactly what's wrong, e.g. "needs
// a number" instead of a generic "invalid password".

/** Every validator has this shape: given a value, return an error message, or null if it's valid. */
export type Validator = (value: string) => string | null;

/** Combine several validators into one - runs each in order, returns the first error found. */
export function composeValidators(...validators: Validator[]): Validator {
  return (value: string) => {
    for (const validate of validators) {
      const error = validate(value);
      if (error) return error;
    }
    return null;
  };
}

export function validateRequired(label = 'This field'): Validator {
  return (value: string) => (value.trim() ? null : `${label} is required.`);
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MIN_PASSWORD_LENGTH = 10;
const HAS_LETTER = /[a-zA-Z]/;
const HAS_NUMBER = /[0-9]/;
const HAS_SPECIAL_CHAR = /[!@#$%^&*()_+=[\]{}|\\:;"'<>,.?/~-]/;
/** Same character repeated 4+ times in a row, e.g. "aaaa" or "1111". */
const HAS_REPEATED_RUN = /(.)\1{3,}/;

/**
 * Heuristic denylist for "no common phrases" - matched as a substring, not
 * an exact match, so "MyPassword123!" is still rejected for containing
 * "password". This is necessarily incomplete (a real check would run
 * server-side against a proper breached-password list); it's meant to
 * catch the obvious cases and give fast UI feedback.
 */
const COMMON_PHRASES = [
  'password',
  'letmein',
  'qwerty',
  'welcome',
  'iloveyou',
  'admin',
  'football',
  'dragon',
  'monkey',
  'trustno1',
  'sunshine',
];

export function validateEmail(value: string): string | null {
  if (!value) return 'Email is required.';
  if (!EMAIL_PATTERN.test(value)) return 'Enter a valid email address.';
  return null;
}

/**
 * Used for actual form validation (blocking submit, showing one error at a
 * time under the field) - stops at the first failing rule. For a live
 * "which rules are met" checklist, use getPasswordRuleStatus instead, which
 * evaluates every rule independently.
 */
export function validatePassword(value: string): string | null {
  if (!value) return 'Password is required.';
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (!HAS_LETTER.test(value)) return 'Password must include at least one letter.';
  if (!HAS_NUMBER.test(value)) return 'Password must include at least one number.';
  if (!HAS_SPECIAL_CHAR.test(value)) {
    return 'Password must include at least one special character (e.g. !@#$%^&*).';
  }
  if (HAS_REPEATED_RUN.test(value)) {
    return "Password can't repeat the same character several times in a row.";
  }

  const lower = value.toLowerCase();
  if (COMMON_PHRASES.some((phrase) => lower.includes(phrase))) {
    return 'Password is too common - avoid dictionary words or well-known passwords.';
  }

  return null;
}

export type PasswordRuleKey =
  | 'minLength'
  | 'hasLetter'
  | 'hasNumber'
  | 'hasSpecialChar'
  | 'noRepeatedRun'
  | 'noCommonPhrase';

export type PasswordRuleStatus = Record<PasswordRuleKey, boolean>;

/** Human-readable label for each rule, in the order they should be displayed. */
export const PASSWORD_RULE_LABELS: Record<PasswordRuleKey, string> = {
  minLength: `At least ${MIN_PASSWORD_LENGTH} characters`,
  hasLetter: 'At least one letter',
  hasNumber: 'At least one number',
  hasSpecialChar: 'At least one special character (e.g. !@#$%^&*)',
  noRepeatedRun: "Doesn't repeat the same character 4+ times in a row",
  noCommonPhrase: "Isn't a common word or well-known password",
};

/**
 * Evaluates every password rule independently (no early return, unlike
 * validatePassword) so a checklist UI can show which ones are already met
 * while the person is still typing. Each boolean is true when that rule is
 * SATISFIED - e.g. `noRepeatedRun: true` means there's no bad repetition.
 */
export function getPasswordRuleStatus(value: string): PasswordRuleStatus {
  const lower = value.toLowerCase();

  return {
    minLength: value.length >= MIN_PASSWORD_LENGTH,
    hasLetter: HAS_LETTER.test(value),
    hasNumber: HAS_NUMBER.test(value),
    hasSpecialChar: HAS_SPECIAL_CHAR.test(value),
    noRepeatedRun: !HAS_REPEATED_RUN.test(value),
    noCommonPhrase: !COMMON_PHRASES.some((phrase) => lower.includes(phrase)),
  };
}