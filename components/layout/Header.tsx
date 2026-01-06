"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/context/AppStore";
import { getLabel } from "@/lib/translations";
import { USER_STATUS } from "@/lib/constants";
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
  LogOut,
  CreditCard,
  Activity,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

interface HeaderProps {
  variant?: "landing" | "auth" | "simple";
  onOpenFilters?: () => void;
  isGhostMode?: boolean;
  onToggleGhostMode?: () => void;
  onBack?: () => void;
  backHref?: string;
  className?: string;
  action?: React.ReactNode;
  title?: string;
  showLogo?: boolean;
}

// --- Local Sub-components ---
const HeaderLogo = ({
  onBack,
  backHref,
  title,
  showLogo = true,
}: {
  onBack?: () => void;
  backHref?: string;
  title?: string;
  showLogo?: boolean;
}) => (
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

    {/* If title is provided and showLogo is false, show Title. otherwise show Logo (or both if designed) */}
    {title && !showLogo ? (
      <h1 className="text-xl font-bold tracking-tight">{title}</h1>
    ) : (
      <Link href="/" className="group flex items-center gap-2">
        <Logo size={42} />
      </Link>
    )}
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
  action,
  title,
  showLogo = true,
}: HeaderProps) {
  const { language, setLanguage, matches, currentUser, logout, setStatus, getLastActivity } =
    useAppStore();

  const [idleTime, setIdleTime] = React.useState("00:00");

  React.useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    // Default 15 mins if env not set
    const AUTO_LOGOUT_MINS = parseInt(process.env.NEXT_PUBLIC_AUTO_LOGOUT_MINUTES || "15");
    const TIMEOUT_MS = AUTO_LOGOUT_MINS * 60 * 1000;

    const interval = setInterval(() => {
      const lastActive = getLastActivity();
      const now = Date.now();
      const elapsed = now - lastActive;
      const remaining = Math.max(0, TIMEOUT_MS - elapsed);

      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      setIdleTime(`${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [getLastActivity]);

  const status = currentUser?.userStatus;
  const isInvisible = status === USER_STATUS.INVISIBLE || status === USER_STATUS.OFFLINE;

  let statusColor = "bg-slate-300 ring-slate-300/20"; // Default Neutral/Offline if unknown
  if (status === USER_STATUS.ONLINE) statusColor = "bg-green-500 ring-green-500/20";
  else if (status === USER_STATUS.AWAY) statusColor = "bg-orange-500 ring-orange-500/20";
  else if (status === USER_STATUS.OFFLINE) statusColor = "bg-red-500 ring-red-500/20";
  else if (status === USER_STATUS.INVISIBLE) statusColor = "bg-red-500 ring-red-500/20";

  const devIdleTimer =
    process.env.NODE_ENV === "development" && currentUser ? (
      <div className="bg-destructive/10 text-destructive border-destructive/20 hidden rounded-md border px-2 py-1 font-mono text-[10px] font-bold sm:block">
        IDLE: {idleTime}
      </div>
    ) : null;

  const langSwitcher = (
    <div className="flex items-center gap-2">
      {devIdleTimer}
      <LanguageSwitcher language={language} onLanguageChange={setLanguage} />
    </div>
  );

  const logo = <HeaderLogo onBack={onBack} backHref={backHref} title={title} showLogo={showLogo} />;

  if (variant === "auth") {
    // If no current user, we shouldn't show the full auth header or at least not the user parts
    // But since this is specific to Dashboard, we might want to show a skeleton or redirect.
    // purely for UI stability, let's render a skeleton user if loading, or empty if null.
    // However, Dashboard usually requires auth.

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
          {devIdleTimer}

          {onToggleGhostMode && (
            <Button size="icon" variant="ghost" onClick={onToggleGhostMode}>
              {isGhostMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          )}

          {onOpenFilters && (
            <Button size="icon" variant="ghost" onClick={onOpenFilters} className="rounded-full">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          )}

          <div className="bg-border/50 mx-1 hidden h-4 w-[1px] sm:block" />

          {currentUser ? (
            <>
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

              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className={cn(
                      "relative h-9 w-9 rounded-full p-[2.5px] shadow-sm transition-all",
                      `${statusColor.split(" ")[0]} hover:${statusColor.split(" ")[0]} ring-4 ${
                        statusColor.split(" ")[1]
                      }`
                    )}
                  >
                    <div className="bg-background relative flex h-full w-full items-center justify-center overflow-hidden rounded-full">
                      {currentUser?.images?.[0]?.url ? (
                        <Image
                          src={currentUser.images[0].url}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <User className="text-muted-foreground h-5 min-h-[20px] w-5 min-w-[20px]" />
                      )}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 rounded-xl border-0 p-2 shadow-2xl ring-1 ring-black/5 backdrop-blur-3xl"
                >
                  {/* User Header */}
                  <DropdownMenuLabel className="flex flex-col items-center justify-center p-0 pt-6 pb-4 font-normal">
                    <div
                      className={cn(
                        "relative mb-4 h-16 w-16 rounded-full p-[3px] shadow-xl transition-all",
                        `${statusColor.split(" ")[0]} ring-4 ${statusColor.split(" ")[1]}`
                      )}
                    >
                      <div className="bg-background relative flex h-full w-full items-center justify-center overflow-hidden rounded-full">
                        {currentUser?.images?.[0]?.url ? (
                          <Image
                            src={currentUser.images[0].url}
                            alt="Profile"
                            fill
                            className="object-cover transition-transform hover:scale-105"
                          />
                        ) : (
                          <User className="text-muted-foreground m-auto h-9 min-h-[36px] w-9 min-w-[36px]" />
                        )}
                      </div>
                    </div>
                    <div className="text-center">
                      <h4 className="text-foreground text-lg font-bold">
                        {currentUser?.firstName} {currentUser?.lastName}
                      </h4>
                      <p className="text-muted-foreground text-xs font-medium">
                        {currentUser?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-border/30 my-2" />

                  <DropdownMenuGroup className="p-1">
                    <div
                      className="mx-1 flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 hover:bg-slate-50"
                      onClick={(e) => {
                        // Prevent dropdown from closing and toggle status
                        e.stopPropagation();
                        setStatus(isInvisible ? USER_STATUS.ONLINE : USER_STATUS.INVISIBLE);
                        console.log("Toggling ghost mode via div click");
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {isInvisible ? (
                          <EyeOff className="text-muted-foreground h-4 w-4" />
                        ) : (
                          <Eye className="text-primary h-4 w-4" />
                        )}
                        <span className="text-xs font-bold select-none">Görünmez Mod</span>
                      </div>
                      <Switch
                        checked={isInvisible}
                        onCheckedChange={(checked: boolean) => {
                          setStatus(checked ? USER_STATUS.INVISIBLE : USER_STATUS.ONLINE);
                          console.log("Toggling ghost mode via switch change");
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    <DropdownMenuSeparator className="bg-border/30 my-2" />

                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profil</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Ayarlar</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/settings/billing" className="cursor-pointer">
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Ödemeler</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/activity" className="cursor-pointer">
                        <Activity className="mr-2 h-4 w-4" />
                        <span>Hareketler</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="#" className="cursor-pointer">
                        <Sun className="mr-2 h-4 w-4" />
                        <span>Görünüm</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive cursor-pointer"
                    onClick={async () => {
                      await logout();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Çıkış Yap</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-bold">
                  Giriş Yap
                </Button>
              </Link>
            </div>
          )}
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
        <div className="flex items-center gap-2">
          {action}
          {langSwitcher}
        </div>
      </header>
    );
  }
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
          {currentUser && (currentUser.email || currentUser.firstName) ? (
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground hidden text-[13px] font-bold md:block">
                {currentUser.firstName || "Profilim"}
              </span>
              <div className="relative">
                <Link href="/profile" title={currentUser.firstName || "Profilim"}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "group relative h-9 w-9 rounded-full p-[2.5px] shadow-sm transition-all",
                      `${statusColor.split(" ")[0]} hover:${statusColor.split(" ")[0]} ring-4 ${
                        statusColor.split(" ")[1]
                      }`
                    )}
                  >
                    <div className="bg-background relative flex h-full w-full items-center justify-center overflow-hidden rounded-full p-0">
                      {currentUser.images?.[0]?.url ? (
                        <Image
                          src={currentUser.images[0].url}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <User className="text-muted-foreground h-4 w-4" />
                      )}
                    </div>
                  </Button>
                </Link>
              </div>
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
