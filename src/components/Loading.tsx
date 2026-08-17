import { cn } from '@/shadcn/lib/utils';
import { LoaderIcon } from 'lucide-react';
type LoadingProps = {
  text?: string;
  className?: string;
};
function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn('size-5 animate-spin', className)}
      {...props}
    />
  );
}

export function SpinnerCustom({ text = ' ', className = '' }: LoadingProps) {
  return (
    <div className="flex items-center justify-center gap-4 p-7 text-primary">
      <p>{text}</p>
      <Spinner color="#333333" spacing={10} className={className} />
    </div>
  );
}
