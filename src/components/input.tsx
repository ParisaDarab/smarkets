import { useState, type ChangeEvent, type FocusEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { inputs } from '@/lib/i18n/en';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/shadcn/components/ui/field';
import { Input } from '@/shadcn/components/ui/input';
import { cn } from '@/shadcn/lib/utils';
import type { Validator } from '@/lib/validation/validation';

type CustomInputProps = {
  id: string;
  value: string;
  onchange: (value: string) => void;
  validate?: Validator | Validator[];
  onValidate?: (error: string | null) => void;
  forceValidate?: boolean;
  required?: boolean;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  description?: string;
  Label?: string;
  ariaLabel?: string;
  className?: string;
  autoComplete?: string;
};

export function CustomInput({
  id,
  value,
  onchange,
  validate,
  onValidate,
  forceValidate = false,
  required = false,
  type = 'email',
  placeholder = inputs.emailPlaceholder,
  disabled = false,
  description = '',
  Label = '',
  ariaLabel,
  className = '',
  autoComplete,
}: CustomInputProps) {
  const [touched, setTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const resolvedType = isPassword && showPassword ? 'text' : type;

  const runValidation = (currentValue: string): string | null => {
    if (!validate) return null;
    const validators = Array.isArray(validate) ? validate : [validate];
    for (const validator of validators) {
      const message = validator(currentValue);
      if (message) return message;
    }
    return null;
  };

  const error = touched || forceValidate ? runValidation(value) : null;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onchange(event.target.value);
  };

  const handleBlur = (_event: FocusEvent<HTMLInputElement>) => {
    setTouched(true);
    onValidate?.(runValidation(value));
  };

  return (
    <Field data-invalid={Boolean(error)}>
      {Label && (
        <FieldLabel htmlFor={id}>
          {Label}
          {required && <span className="text-destructive"> *</span>}
        </FieldLabel>
      )}
      <div className="relative">
        <Input
          required={required}
          id={id}
          type={resolvedType}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(isPassword && 'pr-9', className)}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={Boolean(error)}
          aria-label={ariaLabel ?? (Label || undefined)}
          autoComplete={autoComplete}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
            className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error ? (
        <FieldError>{error}</FieldError>
      ) : (
        description && <FieldDescription>{description}</FieldDescription>
      )}
    </Field>
  );
}
