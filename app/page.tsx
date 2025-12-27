"use client";

import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import Link from "next/link";
import { Heart, Shield, Users } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useAppStore } from "@/context/AppStore";
import { getLabel } from "@/lib/translations";
import { createGuestUser } from "@/lib/actions/userActions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function Home() {
  const { language } = useAppStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      await createGuestUser();
      router.push("/onboarding");
    } finally {
      // Don't set loading false to prevent flicker during redirect
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <Logo size={40} />
        <div className="flex items-center gap-4">
          <Typography variant="body" className="hidden sm:block text-gray-500">
            {getLabel("already_member", language)}
          </Typography>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/login">
                <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                  {getLabel("btn_login", language)}
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{language === 'tr' ? 'Hesabınıza giriş yapın' : 'Sign in to your account'}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-20 px-6 text-center border-b border-gray-100 flex-1 flex flex-col justify-center items-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <Typography variant="h1" className="text-purple-900 leading-tight">
            {getLabel('hero_title', language)}
          </Typography>
          <Typography variant="body-large" className="text-gray-600 max-w-2xl mx-auto">
            {getLabel('hero_subtitle', language)}
          </Typography>

          <div className="pt-8 animate-pulse">
            <Button
              onClick={handleStart}
              disabled={loading}
              size="lg"
              className="w-full sm:w-auto text-xl px-12 py-8 shadow-xl bg-purple-600 hover:bg-purple-700"
              data-testid="landing-cta-button"
            >
              {loading ? "..." : getLabel('cta_button', language)}
            </Button>
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
