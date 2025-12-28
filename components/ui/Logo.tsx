import React from 'react';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';

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
                    "rounded-full flex items-center justify-center text-white shadow-md transition-transform duration-500",
                    grayscale
                        ? "bg-slate-200 shadow-none border border-slate-300"
                        : "bg-gradient-to-tr from-primary to-rose-400"
                )}
                style={{ width: size, height: size }}
            >
                <Heart
                    className={cn(
                        "fill-current",
                        grayscale ? "text-slate-400" : "text-white"
                    )}
                    size={size * 0.5}
                    strokeWidth={2.5}
                />
            </div>
            <span
                className={cn(
                    "font-serif font-bold tracking-tight transition-colors duration-500",
                    grayscale
                        ? "text-slate-400"
                        : "text-slate-900 dark:text-white"
                )}
                style={{ fontSize: size * 0.52 }}
            >
                SecondSpring
            </span>
        </div>
    );
}
