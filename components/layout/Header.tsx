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
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface HeaderProps {
  variant?: "landing" | "auth" | "simple";
  onOpenFilters?: () => void;
  isGhostMode?: boolean;
  onToggleGhostMode?: () => void;
  onBack?: () => void;
  backHref?: string;
  className?: string;
}

// --- Local Sub-components ---
const HeaderLogo = ({ onBack, backHref }: { onBack?: () => void; backHref?: string }) => (
  <div className="flex items-center gap-4">
    {(onBack || backHref) && (
      <>
        {backHref ? (
          <Link
            href={backHref}
            className="text-muted-foreground hover:text-foreground bg-secondary/50 flex h-9 w-9 items-center justify-center rounded-full transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
        ) : (
          <button
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground bg-secondary/50 flex h-9 w-9 items-center justify-center rounded-full transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
      </>
    )}
    <Link href="/" className="group flex items-center gap-2">
      <Logo size={42} />
    </Link>
  </div>
);

const LanguageSwitcher = ({
  language,
  onLanguageChange,
}: {
  language: "tr" | "en";
  onLanguageChange: (lang: "tr" | "en") => void;
}) => (
  <div className="bg-secondary/50 border-border/50 flex items-center gap-2 rounded-full border p-1">
    {(["tr", "en"] as const).map((lang) => (
      <button
        key={lang}
        onClick={() => onLanguageChange(lang)}
        className={cn(
          "rounded-full px-3 py-1 text-[10px] font-bold transition-all",
          language === lang
            ? "text-primary bg-white shadow-sm"
            : "text-muted-foreground/60 hover:text-foreground"
        )}
      >
        {lang.toUpperCase()}
      </button>
    ))}
  </div>
);

const NavLinks = ({ language }: { language: "tr" | "en" }) => (
  <nav className="hidden items-center gap-10 lg:flex">
    {[
      { id: "nav_story", href: "#" },
      { id: "nav_why_us", href: "#why-us" },
      { id: "nav_faq", href: "#faq" },
    ].map((link) => (
      <a
        key={link.id}
        href={link.href}
        className="text-muted-foreground hover:text-primary group relative text-[14px] font-semibold transition-colors"
      >
        {getLabel(link.id, language)}
        <span className="bg-primary absolute -bottom-1 left-0 h-[2px] w-0 rounded-full transition-all group-hover:w-full" />
      </a>
    ))}
  </nav>
);

// --- Main Header Component ---
export function Header({
  variant = "landing",
  onOpenFilters,
  isGhostMode,
  onToggleGhostMode,
  onBack,
  backHref,
  className,
}: HeaderProps) {
  const { language, setLanguage, matches, currentUser } = useAppStore();

  const langSwitcher = <LanguageSwitcher language={language} onLanguageChange={setLanguage} />;

  const logo = <HeaderLogo onBack={onBack} backHref={backHref} />;

  if (variant === "auth") {
    return (
      <header
        data-testid="header-auth"
        className={cn(
          "bg-background sticky top-0 z-50 flex h-16 items-center justify-between border-b px-12 shadow-2xs",
          className
        )}
      >
        {logo}

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

  if (variant === "simple") {
    return (
      <header
        data-testid="header-simple"
        className={cn(
          "sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-white/70 px-12 shadow-2xs backdrop-blur-2xl",
          className
        )}
      >
        {logo}
        {langSwitcher}
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
      <div className="flex flex-1 items-center">{logo}</div>

      <NavLinks language={language} />

      <div className="flex flex-1 items-center justify-end gap-6">
        {langSwitcher}

        <div className="bg-border/50 h-4 w-[1px]" />

        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground hidden text-[13px] font-bold md:block">
                {currentUser.firstName || "Profilim"}
              </span>
              <Link href="/profile">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-primary/5 hover:text-primary group border-border/50 relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border p-0"
                >
                  {currentUser.images?.[0]?.url ? (
                    <Image
                      src={currentUser.images[0].url}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>
              </Link>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </header>
  );
}
