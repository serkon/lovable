import * as React from "react"

// I will not use Slot for now to avoid installing another dep unless I need polymorphism.
// Re-writing without Slot for simplicity unless I see a need.

// Wait, I didn't install class-variance-authority. I need to install it.
// Checking plan: "Button.tsx: High contrast, large padding."
// I will install class-variance-authority as it's standard for variants.

// Let's hold off on this specific file and run the install command first in the same turn or next turn.
// Actually, I can just write a simpler button without CVA for now to move fast, or install it.
// I'll install it to be professional.
// But I can't run install and write file consuming it safely in parallel if I want to be 100% sure, though usually it's fine.
// I'll use standard props for now to save time and complexity.

import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    
    const variants = {
      primary: "bg-purple-600 text-white hover:bg-purple-700 shadow-md",
      secondary: "bg-pink-100 text-pink-900 hover:bg-pink-200",
      outline: "border-2 border-purple-200 bg-transparent hover:bg-purple-50 text-purple-700",
      ghost: "hover:bg-gray-100 text-gray-700",
    }
    
    const sizes = {
      default: "h-12 px-6 py-2 rounded-xl text-base font-medium",
      sm: "h-9 px-3 rounded-lg text-sm", // Added small size
      lg: "h-14 px-8 rounded-2xl text-lg font-semibold",
      icon: "h-12 w-12 rounded-xl p-2",
    }

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
