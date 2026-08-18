import { home } from '@/lib/i18n/en';
import { PackageOpen } from 'lucide-react';
type EmptyListProps={
  text?:string
}
export const EmptyList = ({ text = home.liveEmpty }: EmptyListProps) => {
  return (
    <div className="flex justify-center items-center absolute top-1/2 left-1/2 -translate-x-1/2">
      <p className="text-md text-muted-foreground text-center p-5">{text}</p>
      <PackageOpen color="gray" size={35} />
    </div>
  );
};
