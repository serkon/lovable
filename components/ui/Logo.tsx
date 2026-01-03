import React from "react";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

interface LogoProps {
  className?: string;
  size?: number;
  grayscale?: boolean;
}

export function Logo({ className, size = 40, grayscale = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-full text-white shadow-md transition-transform duration-500",
          grayscale
            ? "border border-slate-300 bg-slate-200 shadow-none"
            : "from-primary bg-gradient-to-tr to-rose-400"
        )}
        style={{ width: size, height: size }}
      >
        <Heart
          className={cn("fill-current", grayscale ? "text-slate-400" : "text-white")}
          size={size * 0.45}
          strokeWidth={2.5}
        />
      </div>
      <span
        className={cn(
          "font-playfair hidden text-lg font-bold tracking-tight transition-colors duration-500 sm:block",
          grayscale ? "text-slate-400" : "text-neutral-900 dark:text-white"
        )}
        style={{ fontSize: size * 0.5 }}
      >
        NextChapter
      </span>
    </div>
  );
}
