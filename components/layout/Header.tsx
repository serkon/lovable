"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/context/AppStore";
import { getLabel } from "@/lib/translations";
import {
  ArrowRight,
  MessageCircle,
  Clock,
  Heart,
  SlidersHorizontal,
  Eye,
  EyeOff,
  User,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface HeaderProps {
  variant?: "landing" | "dashboard" | "auth" | "simple";
  onOpenFilters?: () => void;
  isGhostMode?: boolean;
  onToggleGhostMode?: () => void;
  className?: string;
}

export function Header({
  variant = "landing",
  onOpenFilters,
  isGhostMode,
  onToggleGhostMode,
  className,
}: HeaderProps) {
  const { language, setLanguage, matches, currentUser } = useAppStore();

  const commonLanguageSwitcher = (
    <div className="bg-secondary/50 border-border/50 flex items-center gap-2 rounded-full border p-1">
      <button
        onClick={() => setLanguage("tr")}
        className={cn(
          "rounded-full px-3 py-1 text-[10px] font-bold transition-all",
          language === "tr"
            ? "text-primary bg-white shadow-sm"
            : "text-muted-foreground/60 hover:text-foreground"
        )}
      >
        TR
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={cn(
          "rounded-full px-3 py-1 text-[10px] font-bold transition-all",
          language === "en"
            ? "text-primary bg-white shadow-sm"
            : "text-muted-foreground/60 hover:text-foreground"
        )}
      >
        EN
      </button>
    </div>
  );

  if (variant === "dashboard") {
    return (
      <header
        data-testid="header-dashboard"
        className={cn(
          "bg-background sticky top-0 z-50 flex h-16 items-center justify-between border-b px-12 shadow-2xs",
          className
        )}
      >
        <Link href="/" className="group flex items-center gap-2">
          <Logo size={32} />
          <span className="font-playfair hidden text-lg font-bold tracking-tight sm:block">
            SecondSpring
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {onToggleGhostMode && (
            <Button
              size="icon"
              variant="ghost"
              onClick={onToggleGhostMode}
              className="rounded-full"
            >
              {isGhostMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          )}

          {onOpenFilters && (
            <Button size="icon" variant="ghost" onClick={onOpenFilters} className="rounded-full">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          )}

          <div className="bg-border/50 mx-1 hidden h-4 w-[1px] sm:block" />

          <Link href="/sent-requests">
            <Button size="icon" variant="ghost" className="rounded-full">
              <Clock className="h-4 w-4" />
            </Button>
          </Link>

          <Link href="/matches">
            <Button size="icon" variant="ghost" className="relative rounded-full">
              <MessageCircle className="h-4 w-4" />
              {matches.length > 0 && (
                <span className="bg-primary border-background absolute top-2 right-2 h-2 w-2 rounded-full border-2"></span>
              )}
            </Button>
          </Link>

          <Link href="/likes">
            <Button size="icon" variant="ghost" className="relative rounded-full">
              <Heart className="h-4 w-4" />
              <span className="bg-primary border-background absolute top-2 right-2 h-2 w-2 rounded-full border-2"></span>
            </Button>
          </Link>

          <div className="bg-border/50 mx-1 h-4 w-[1px]" />

          <Link href="/profile">
            <Button
              size="icon"
              variant="ghost"
              className="border-border/50 relative overflow-hidden rounded-full border"
            >
              {currentUser?.images?.[0]?.url ? (
                <Image
                  src={currentUser.images[0].url}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <User className="h-4 w-4" />
              )}
            </Button>
          </Link>

          <Link href="/settings">
            <Button size="icon" variant="ghost" className="rounded-full">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>
    );
  }

  if (variant === "simple" || variant === "auth") {
    return (
      <header
        data-testid="header-auth"
        className={cn(
          "sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-white/70 px-12 shadow-2xs backdrop-blur-2xl",
          className
        )}
      >
        <Link href="/">
          <Logo size={36} />
        </Link>
        {commonLanguageSwitcher}
      </header>
    );
  }

  // Default: Landing Variant
  return (
    <header
      data-testid="header-landing"
      className={cn(
        "sticky top-0 z-50 flex h-24 items-center justify-between border-b border-white/20 bg-white/70 px-12 shadow-2xs backdrop-blur-2xl transition-all duration-300",
        className
      )}
    >
      {/* Left: Logo */}
      <div className="flex flex-1 items-center">
        <Link href="/">
          <Logo size={40} />
        </Link>
      </div>

      {/* Center: Navigation */}
      <nav className="hidden items-center gap-10 lg:flex">
        <a
          href="#"
          className="text-muted-foreground hover:text-primary group relative text-[14px] font-semibold transition-colors"
        >
          {getLabel("nav_story", language)}
          <span className="bg-primary absolute -bottom-1 left-0 h-[2px] w-0 rounded-full transition-all group-hover:w-full" />
        </a>
        <a
          href="#why-us"
          className="text-muted-foreground hover:text-primary group relative text-[14px] font-semibold transition-colors"
        >
          {getLabel("nav_why_us", language)}
          <span className="bg-primary absolute -bottom-1 left-0 h-[2px] w-0 rounded-full transition-all group-hover:w-full" />
        </a>
        <a
          href="#faq"
          className="text-muted-foreground hover:text-primary group relative text-[14px] font-semibold transition-colors"
        >
          {getLabel("nav_faq", language)}
          <span className="bg-primary absolute -bottom-1 left-0 h-[2px] w-0 rounded-full transition-all group-hover:w-full" />
        </a>
      </nav>

      {/* Right: Actions */}
      <div className="flex flex-1 items-center justify-end gap-6">
        {commonLanguageSwitcher}

        <div className="bg-border/50 h-4 w-[1px]" />

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground hidden text-[12px] font-medium md:block">
            {getLabel("already_member", language)}
          </span>
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-primary/5 hover:text-primary group text-[13px] font-bold"
            >
              {getLabel("btn_login", language)}
              <ArrowRight className="ml-1 h-4 w-4 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
