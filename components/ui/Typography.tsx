import React from "react";
import { cn } from "@/lib/utils";

type TypographyVariant = "h1" | "h2" | "h3" | "body" | "body-large" | "caption";

interface TypographyProps extends React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement> {
  variant?: TypographyVariant;
  children: React.ReactNode;
  as?: React.ElementType;
}

export function Typography({
  variant = "body",
  className,
  as,
  children,
  ...props
}: TypographyProps) {
  const Component = as || 
    (variant === "h1" ? "h1" : 
     variant === "h2" ? "h2" : 
     variant === "h3" ? "h3" : "p");

  const styles = {
    h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
    h2: "scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0",
    h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
    "body-large": "text-lg md:text-xl leading-8", // Larger body text for better readability
    body: "text-base md:text-lg leading-7",
    caption: "text-sm text-muted-foreground",
  };

  return (
    <Component className={cn(styles[variant], className)} {...props}>
      {children}
    </Component>
  );
}
