import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChoiceOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface ChoiceCardProps {
  option: ChoiceOption;
  isSelected: boolean;
  onSelect: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  iconContainerClassName?: string;
}

const sizeClasses = {
  sm: {
    card: "p-3 gap-3 rounded-lg border",
    iconCircle: "h-8 w-8",
    svgContainer: "h-4 w-4",
    text: "text-sm",
    check: "h-4 w-4",
  },
  md: {
    card: "p-4 gap-4 rounded-xl border",
    iconCircle: "h-10 w-10",
    svgContainer: "h-6 w-6",
    text: "text-base",
    check: "h-5 w-5",
  },
  lg: {
    card: "p-4 gap-5 rounded-2xl border-2 hover:shadow-lg",
    iconCircle: "h-10 w-10",
    svgContainer: "h-6 w-6",
    text: "text-lg",
    check: "h-6 w-6",
  },
};

export function ChoiceCard({
  option,
  isSelected,
  onSelect,
  size = "md",
  className,
  iconContainerClassName,
}: ChoiceCardProps) {
  const sizes = sizeClasses[size];
  console.log(sizes);

  return (
    <div
      onClick={onSelect}
      className={cn(
        "bg-card flex cursor-pointer items-center transition-all",
        sizes.card,
        isSelected
          ? cn("border-primary bg-primary/5 dark:bg-primary/10", size === "lg" && "border-[3px]")
          : "border-border",
        className
      )}
    >
      {option.icon && (
        <div
          className={cn(
            "a flex items-center justify-center rounded-full transition-colors",
            sizes.iconCircle,
            isSelected ? "bg-primary/10 text-primary" : "text-muted-foreground bg-neutral-100",
            iconContainerClassName
          )}
        >
          <div
            className={cn(sizes.svgContainer, "[&_svg]:h-full [&_svg]:w-full")}
            data-testid="choice-card-svg-container"
          >
            {option.icon}
          </div>
        </div>
      )}
      <p className={cn("font-dm-sans flex-1", !className?.includes("text-") && sizes.text)}>
        {option.label}
      </p>
      <div
        className={cn(
          "flex items-center justify-center rounded-full border-2 transition-all",
          sizes.check,
          isSelected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border text-transparent"
        )}
      >
        <Check className={cn("h-4 w-4", isSelected && "text-primary-foreground")} />
      </div>
    </div>
  );
}
