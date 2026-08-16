import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@/shadcn/components/ui/field';
import { Input } from '@/shadcn/components/ui/input';

type Input = {
  type: string;
  placeholder: string;
  disabled: boolean;
  description: string;
  Label: string;
};
export function CustomInput({
  type = 'email',
  placeholder = 'name@example.com',
  disabled = false,
  description = 'This field is currently not disabled.',
  Label = 'Email',
}: Input) {
  return (
    <Field>
      {Label && <FieldLabel htmlFor="input-demo-disabled">{Label}</FieldLabel>}
      <Input
        id="input-demo-disabled"
        type={type}
        placeholder={placeholder}
        disabled={disabled}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
}
