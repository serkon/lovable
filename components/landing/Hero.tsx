"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Heart, Star, Sparkles, ArrowRight, Shield, Lock, MessageCircle } from "lucide-react";
import { getLabel } from "@/lib/translations";
import Image from "next/image";

import { HeroProfile } from "@/lib/actions/publicActions";

interface HeroProps {
  language: "tr" | "en";
  onStart: () => void;
  loading?: boolean;
  profiles?: HeroProfile[];
}

export function Hero({ language, onStart, loading, profiles = [] }: HeroProps) {
  return (
    <section
      data-testid="hero-section"
      className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-16"
    >
      {/* Atmospheric Elements - Distributed & Varied */}
      <div className="atmosphere-item animate-float-y slow top-20 left-[5%]">
        <Heart className="h-12 w-12" />
      </div>
      <div className="atmosphere-item animate-float-x fast top-40 left-[15%]">
        <Star className="h-6 w-6" />
      </div>
      <div className="atmosphere-item animate-pulse-soft top-[60%] left-[4%]">
        <Heart className="h-8 w-8" />
      </div>
      <div className="atmosphere-item animate-float-y fast top-32 right-[10%]">
        <Star className="h-14 w-14" />
      </div>
      <div className="atmosphere-item animate-float-x slow top-[50%] right-[3%]">
        <Heart className="h-10 w-10" />
      </div>
      <div className="atmosphere-item animate-pulse-soft right-[15%] bottom-10">
        <Star className="h-8 w-8" />
      </div>
      <div className="atmosphere-item animate-float-y bottom-12 left-[10%]">
        <Heart className="h-14 w-14" />
      </div>
      <div
        data-testid="hero-content"
        className="relative z-10 mx-auto max-w-5xl space-y-12 text-center"
      >
        <div className="bg-primary/5 border-primary/20 text-primary animate-in fade-in slide-in-from-bottom-3 inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm tracking-wider duration-1000">
          <Sparkles className="h-4 w-4" />
          <span>{getLabel("hero_badge", language)}</span>
        </div>

        <h1 className="animate-in fade-in slide-in-from-bottom-5 leading-[1.05] delay-150 duration-1000">
          {language === "tr" ? (
            <>
              Hayatın <span className="text-emphasized">İkinci Baharı</span>
              <br className="hidden sm:block" /> Sizi Bekliyor
            </>
          ) : (
            <>
              Your <span className="text-emphasized">Second Spring</span>
              <br className="hidden sm:block" /> is Waiting
            </>
          )}
        </h1>

        <p className="text-muted-foreground animate-in fade-in slide-in-from-bottom-7 mx-auto max-w-xl text-xl tracking-tight delay-300 duration-1000">
          {getLabel("hero_subtitle", language)}
        </p>

        <div className="animate-in fade-in slide-in-from-bottom-10 flex flex-col items-center justify-center gap-8 delay-500 duration-1000">
          <Button
            onClick={onStart}
            disabled={loading}
            variant="default"
            size="xl"
            className="group shadow-primary/30 hover:shadow-primary/50 bg-primary hover:bg-primary/90 h-14 rounded-full px-12 text-lg font-bold shadow-2xl transition-all active:scale-95"
          >
            {loading ? "..." : getLabel("cta_button", language)}
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
          </Button>
          {/* Infinite Marquee of Profiles - "Butterfly Effect" */}
          <div
            data-testid="hero-profiles-marquee"
            className="mask-linear-fade relative -my-6 mt-12 w-full max-w-[90vw] overflow-hidden py-6"
          >
            <div className="from-background pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-40 bg-gradient-to-r to-transparent" />
            <div className="from-background pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-40 bg-gradient-to-l to-transparent" />

            <div className="animate-scroll hover:pause flex w-max gap-4">
              {/* Duplicate the list to ensure seamless looping */}
              {[...profiles, ...profiles].map((profile, idx) => (
                <div
                  key={idx}
                  data-testid="hero-profile-card"
                  onClick={onStart}
                  className="bg-muted group relative h-56 w-40 shrink-0 cursor-pointer overflow-hidden rounded-2xl border-4 border-white shadow-lg md:h-64 md:w-48"
                >
                  <Image
                    src={profile.img}
                    alt="Member"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex translate-y-2 transform items-center justify-between gap-2 border-t border-white/30 bg-white/60 p-3 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="min-w-0">
                      <p className="truncate text-sm leading-tight font-bold text-slate-900">
                        {profile.name}, {profile.age}
                      </p>
                      <p className="mt-0.5 truncate text-[10px] font-semibold tracking-wide text-slate-700 uppercase">
                        {profile.loc}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <button className="text-primary flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm transition-transform hover:scale-110">
                        <Heart className="h-3.5 w-3.5 fill-current" />
                      </button>
                      <button className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-blue-500 shadow-sm transition-transform hover:scale-110">
                        <MessageCircle className="h-3.5 w-3.5 fill-current" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-6">
            <div className="text-muted-foreground/60 flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
              <Shield className="h-3.5 w-3.5 text-green-500" />
              <span>{getLabel("verified_profiles", language)}</span>
            </div>
            <div className="text-muted-foreground/60 flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
              <Lock className="text-primary h-3.5 w-3.5" />
              <span>{getLabel("secure_data", language)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
