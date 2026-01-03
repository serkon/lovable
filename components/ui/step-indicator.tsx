import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  onStepClick,
}) => {
  return (
    <div className="mt-16 mb-8 flex min-h-[40px] items-center gap-1 sm:gap-2">
      {[...Array(totalSteps)].map((_, index) => {
        const stepNum = index + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <React.Fragment key={stepNum}>
            {index > 0 && (
              <div
                className={`h-0.5 w-4 rounded sm:w-6 ${
                  isCompleted || isActive ? "bg-primary" : "bg-neutral-200"
                }`}
              />
            )}
            <div
              onClick={() => isCompleted && onStepClick?.(stepNum)}
              className={cn(
                "flex items-center justify-center rounded-full font-bold transition-all duration-300",
                isCompleted
                  ? "bg-primary text-primary-foreground ring-primary dark:ring-offset-background h-8 w-8 text-sm shadow-sm ring-2 ring-offset-2"
                  : isActive
                    ? "bg-primary text-primary-foreground ring-primary/20 dark:ring-primary/30 h-10 w-10 scale-110 transform text-base shadow-lg ring-4"
                    : "border-border bg-card text-muted-foreground h-8 w-8 border text-sm font-medium",
                isCompleted && onStepClick && "cursor-pointer hover:opacity-80"
              )}
            >
              {isCompleted ? <Check className="h-4 w-4" /> : stepNum}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
