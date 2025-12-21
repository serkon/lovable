import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
    className?: string;
    size?: number;
}

export function Logo({ className, size = 48 }: LogoProps) {
    return (
        <div className={cn("flex flex-col items-center gap-2", className)}>
            <div className="relative overflow-hidden rounded-xl" style={{ width: size, height: size }}>
                <Image
                    src="/logo.png"
                    alt="İkinci Bahar Logo"
                    fill
                    className="object-contain"
                    priority
                />
            </div>
        </div>
    );
}
