"use client";

import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import Link from "next/link";
import { Heart, Shield, Users } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useAppStore } from "@/context/AppStore";
import { getLabel } from "@/lib/translations";

export default function Home() {
  const { language } = useAppStore();

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="bg-white py-20 px-6 text-center border-b border-gray-100 flex-1 flex flex-col justify-center items-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <Logo size={120} className="mb-4" />
          <Typography variant="h1" className="text-purple-900 leading-tight">
            {getLabel('hero_title', language)}
          </Typography>
          <Typography variant="body-large" className="text-gray-600 max-w-2xl mx-auto">
            {getLabel('hero_subtitle', language)}
          </Typography>

          <div className="pt-8 animate-pulse">
            <Link href="/onboarding">
              <Button size="lg" className="w-full sm:w-auto text-xl px-12 py-8 shadow-xl bg-purple-600 hover:bg-purple-700" data-testid="landing-cta-button">
                {getLabel('cta_button', language)}
              </Button>
            </Link>
            <p className="mt-4 text-sm text-gray-500 font-medium">{getLabel('cta_no_card', language)}</p>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <Typography variant="h3">{getLabel('feature_real_title', language)}</Typography>
            <Typography variant="body" className="text-gray-600">
              {getLabel('feature_real_desc', language)}
            </Typography>
          </div>

          <div className="space-y-4">
            <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <Typography variant="h3">{getLabel('feature_safe_title', language)}</Typography>
            <Typography variant="body" className="text-gray-600">
              {getLabel('feature_safe_desc', language)}
            </Typography>
          </div>

          <div className="space-y-4">
            <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <Heart className="w-8 h-8 text-purple-600" />
            </div>
            <Typography variant="h3">{getLabel('feature_easy_title', language)}</Typography>
            <Typography variant="body" className="text-gray-600">
              {getLabel('feature_easy_desc', language)}
            </Typography>
          </div>
        </div>
      </section>
    </main>
  );
}
