import { cn } from "@/lib/utils";

interface SectionSeparatorProps {
  label: string;
  icon?: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "full";
  "data-test-id"?: string;
}

const maxWidthClasses = {
  sm: "max-w-[20rem] sm:max-w-[24rem]",
  md: "max-w-[24rem] sm:max-w-[32rem]",
  lg: "max-w-[32rem] sm:max-w-[40rem]",
  full: "max-w-full",
};

export function SectionSeparator({
  label,
  icon,
  className,
  maxWidth = "sm",
  "data-test-id": testId,
}: SectionSeparatorProps) {
  return (
    <div
      className={cn("m-auto flex w-full items-center gap-4", maxWidthClasses[maxWidth], className)}
      data-test-id={testId}
    >
      <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      <span className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
        {icon}
        {label}
      </span>
      <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
    </div>
  );
}
