import * as React from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormGroupProps extends React.ComponentProps<"div"> {
    label?: React.ReactNode
    error?: string
    action?: React.ReactNode
}

export const FormGroup = React.forwardRef<HTMLDivElement, FormGroupProps>(
    ({ label, error, action, className, children, ...props }, ref) => {
        const contentRef = React.useRef<HTMLDivElement>(null);

        const handleLabelClick = () => {
            if (!contentRef.current) return;

            // Select components (Radix UI)
            const selectTrigger = contentRef.current.querySelector('[role="combobox"]') as HTMLElement;
            if (selectTrigger) {
                selectTrigger.click();
                return;
            }

            // Regular button
            const button = contentRef.current.querySelector('button') as HTMLElement;
            if (button) {
                button.click();
                return;
            }

            // Input, textarea, select
            const input = contentRef.current.querySelector('input, textarea, select') as HTMLElement;
            if (input) {
                input.focus();
                return;
            }
        };

        return (
            <div ref={ref} className={cn("space-y-2", className)} {...props}>
                {(label || action) && (
                    <div className="flex items-center justify-between">
                        {label && (
                            <Label
                                onClick={handleLabelClick}
                                className="cursor-pointer"
                            >
                                {label}
                            </Label>
                        )}
                        {action}
                    </div>
                )}
                <div ref={contentRef}>
                    {children}
                </div>
                {error && (
                    <p className="text-sm font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)
FormGroup.displayName = "FormGroup"