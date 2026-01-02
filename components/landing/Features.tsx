"use client";

import React from "react";
import { Users, Shield, Heart } from "lucide-react";
import { getLabel } from "@/lib/translations";

interface FeaturesProps {
  language: "tr" | "en";
}

export function Features({ language }: FeaturesProps) {
  return (
    <section
      id="why-us"
      className="relative scroll-mt-16 border-y bg-slate-50 py-24"
      data-testid="features-section"
    >
      <div className="mx-auto max-w-6xl px-6" data-testid="features-container">
        <h2 className="mb-16 text-center text-3xl font-bold tracking-tight md:text-5xl">
          {getLabel("nav_why_us", language)}
        </h2>

        <div
          className="mb-10 grid grid-cols-1 gap-12 text-center md:grid-cols-3"
          data-testid="features-grid"
        >
          {/* Feature 1 - Real People */}
          <div className="space-y-6">
            <div className="bg-primary/5 text-primary mx-auto flex h-14 w-14 items-center justify-center rounded-full transition-transform hover:scale-110">
              <Users className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">{getLabel("feature_real_title", language)}</h3>
              <p className="text-muted-foreground px-4 text-sm leading-relaxed">
                {getLabel("feature_real_desc", language)}
              </p>
            </div>
          </div>

          {/* Feature 2 - Safety */}
          <div className="space-y-6">
            <div className="bg-primary/5 text-primary mx-auto flex h-14 w-14 items-center justify-center rounded-full transition-transform hover:scale-110">
              <Shield className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">{getLabel("feature_safe_title", language)}</h3>
              <p className="text-muted-foreground px-4 text-sm leading-relaxed">
                {getLabel("feature_safe_desc", language)}
              </p>
            </div>
          </div>

          {/* Feature 3 - Ease of Use */}
          <div className="space-y-6">
            <div className="bg-primary/5 text-primary mx-auto flex h-14 w-14 items-center justify-center rounded-full transition-transform hover:scale-110">
              <Heart className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">{getLabel("feature_easy_title", language)}</h3>
              <p className="text-muted-foreground px-4 text-sm leading-relaxed">
                {getLabel("feature_easy_desc", language)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
