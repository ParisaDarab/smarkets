import { Check, X } from 'lucide-react';
import {
  getPasswordRuleStatus,
  PASSWORD_RULE_LABELS,
  type PasswordRuleKey,
} from '@/lib/validation/validation';
import { cn } from '@/shadcn/lib/utils';

const RULE_ORDER: PasswordRuleKey[] = [
  'minLength',
  'hasLetter',
  'hasNumber',
  'hasSpecialChar',
  'noRepeatedRun',
  'noCommonPhrase',
];

/** Live checklist of Smarkets' password rules - each item turns green as it's satisfied. */
export function PasswordRequirements({ value }: { value: string }) {
  const status = getPasswordRuleStatus(value);

  return (
    <ul className="flex flex-col gap-1">
      {RULE_ORDER.map((key) => {
        const met = status[key];
        return (
          <li
            key={key}
            className={cn(
              'flex items-center gap-1.5 text-xs transition-colors',
              met
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-muted-foreground'
            )}
          >
            {met ? (
              <Check size={14} className="shrink-0" />
            ) : (
              <X size={14} className="shrink-0" />
            )}
            <span>{PASSWORD_RULE_LABELS[key]}</span>
          </li>
        );
      })}
    </ul>
  );
}
