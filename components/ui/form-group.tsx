import * as React from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormGroupProps extends React.ComponentProps<"div"> {
    label?: string
    htmlFor?: string
    error?: string
    action?: React.ReactNode
}

export const FormGroup = React.forwardRef<HTMLDivElement, FormGroupProps>(
    ({ label, htmlFor, error, action, className, children, ...props }, ref) => {
        return (
            <div ref={ref} className={cn("space-y-2", className)} {...props}>
                {(label || action) && (
                    <div className="flex items-center justify-between">
                        {label && <Label htmlFor={htmlFor}>{label}</Label>}
                        {action}
                    </div>
                )}
                {children}
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
