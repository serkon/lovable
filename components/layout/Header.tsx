"use client";

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/context/AppStore';
import { getLabel } from '@/lib/translations';
import { ArrowRight, MessageCircle, Clock, Heart, SlidersHorizontal, Eye, EyeOff, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface HeaderProps {
    variant?: 'landing' | 'dashboard' | 'auth' | 'simple';
    onOpenFilters?: () => void;
    isGhostMode?: boolean;
    onToggleGhostMode?: () => void;
    className?: string;
}

export function Header({
    variant = 'landing',
    onOpenFilters,
    isGhostMode,
    onToggleGhostMode,
    className
}: HeaderProps) {
    const { language, setLanguage, matches, currentUser } = useAppStore();

    const commonLanguageSwitcher = (
        <div className="flex items-center gap-2 p-1 bg-secondary/50 rounded-full border border-border/50">
            <button
                onClick={() => setLanguage('tr')}
                className={cn(
                    "px-3 py-1 text-[10px] font-bold rounded-full transition-all",
                    language === 'tr' ? "bg-white text-primary shadow-sm" : "text-muted-foreground/60 hover:text-foreground"
                )}
            >
                TR
            </button>
            <button
                onClick={() => setLanguage('en')}
                className={cn(
                    "px-3 py-1 text-[10px] font-bold rounded-full transition-all",
                    language === 'en' ? "bg-white text-primary shadow-sm" : "text-muted-foreground/60 hover:text-foreground"
                )}
            >
                EN
            </button>
        </div>
    );

    if (variant === 'dashboard') {
        return (
            <header className={cn("h-16 px-12 bg-background border-b flex justify-between items-center sticky top-0 z-50 shadow-2xs", className)}>
                <Link href="/" className="flex items-center gap-2 group">
                    <Logo size={32} />
                    <span className="font-serif font-bold tracking-tight text-lg hidden sm:block">SecondSpring</span>
                </Link>

                <div className="flex items-center gap-2">
                    {onToggleGhostMode && (
                        <Button size="icon" variant="ghost" onClick={onToggleGhostMode} className="rounded-full">
                            {isGhostMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                    )}

                    {onOpenFilters && (
                        <Button size="icon" variant="ghost" onClick={onOpenFilters} className="rounded-full">
                            <SlidersHorizontal className="w-4 h-4" />
                        </Button>
                    )}

                    <div className="h-4 w-[1px] bg-border/50 mx-1 hidden sm:block" />

                    <Link href="/sent-requests">
                        <Button size="icon" variant="ghost" className="rounded-full">
                            <Clock className="w-4 h-4" />
                        </Button>
                    </Link>

                    <Link href="/matches">
                        <Button size="icon" variant="ghost" className="relative rounded-full">
                            <MessageCircle className="w-4 h-4" />
                            {matches.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>}
                        </Button>
                    </Link>

                    <Link href="/likes">
                        <Button size="icon" variant="ghost" className="relative rounded-full">
                            <Heart className="w-4 h-4" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
                        </Button>
                    </Link>

                    <div className="h-4 w-[1px] bg-border/50 mx-1" />

                    <Link href="/profile">
                        <Button size="icon" variant="ghost" className="relative rounded-full overflow-hidden border border-border/50">
                            {currentUser?.images?.[0]?.url ? (
                                <Image
                                    src={currentUser.images[0].url}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <User className="w-4 h-4" />
                            )}
                        </Button>
                    </Link>

                    <Link href="/settings">
                        <Button size="icon" variant="ghost" className="rounded-full">
                            <Settings className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </header>
        );
    }

    if (variant === 'simple' || variant === 'auth') {
        return (
            <header className={cn("px-12 h-16 flex justify-between items-center border-b sticky top-0 z-50 bg-white/70 backdrop-blur-2xl shadow-2xs", className)}>
                <Link href="/">
                    <Logo size={36} />
                </Link>
                {commonLanguageSwitcher}
            </header>
        );
    }

    // Default: Landing Variant
    return (
        <header className={cn("px-12 h-24 flex justify-between items-center border-b sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-white/20 shadow-2xs transition-all duration-300", className)}>
            {/* Left: Logo */}
            <div className="flex-1 flex items-center">
                <Link href="/">
                    <Logo size={40} />
                </Link>
            </div>

            {/* Center: Navigation */}
            <nav className="hidden lg:flex items-center gap-10">
                <a href="#" className="relative text-[14px] font-semibold text-muted-foreground hover:text-primary transition-colors group">
                    {getLabel('nav_story', language)}
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full rounded-full" />
                </a>
                <a href="#why-us" className="relative text-[14px] font-semibold text-muted-foreground hover:text-primary transition-colors group">
                    {getLabel('nav_why_us', language)}
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full rounded-full" />
                </a>
                <a href="#faq" className="relative text-[14px] font-semibold text-muted-foreground hover:text-primary transition-colors group">
                    {getLabel('nav_faq', language)}
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full rounded-full" />
                </a>
            </nav>

            {/* Right: Actions */}
            <div className="flex-1 flex items-center justify-end gap-6">
                {commonLanguageSwitcher}

                <div className="h-4 w-[1px] bg-border/50" />

                <div className="flex items-center gap-2">
                    <span className="hidden md:block text-[12px] text-muted-foreground font-medium">
                        {getLabel("already_member", language)}
                    </span>
                    <Link href="/login">
                        <Button variant="ghost" size="sm" className="font-bold text-[13px] hover:bg-primary/5 hover:text-primary group">
                            {getLabel("btn_login", language)}
                            <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
