import { cn } from "@/lib/utils";

interface StepDescriptionProps {
  text: string;
  icon?: React.ReactNode;
  className?: string;
  variant?: "default" | "muted" | "info";
  "data-test-id"?: string;
}

const variantClasses = {
  default: "text-neutral-400",
  muted: "text-muted-foreground",
  info: "text-neutral-500",
};

export function StepDescription({
  text,
  icon,
  className,
  variant = "default",
  "data-test-id": testId,
}: StepDescriptionProps) {
  return (
    <div
      className={cn(
        "mb-8 flex items-center justify-center gap-2 text-xs font-medium",
        variantClasses[variant],
        className
      )}
      data-test-id={testId}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{text}</span>
    </div>
  );
}
