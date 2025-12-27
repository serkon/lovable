"use client";

import Link from "next/link";
import { Heart, Shield, Users } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useAppStore } from "@/context/AppStore";
import { getLabel } from "@/lib/translations";
import { createGuestUser } from "@/lib/actions/userActions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      // Keep loading to prevent flicker
    }
  };

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="px-6 py-4 flex justify-between items-center border-b">
          <Logo size={40} />
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-muted-foreground">
              {getLabel("already_member", language)}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/login">
                  <Button variant="outline">
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
        <section className="flex-1 flex flex-col justify-center items-center py-20 px-6">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-foreground">
              {getLabel('hero_title', language)}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {getLabel('hero_subtitle', language)}
            </p>

            <div className="space-y-4">
              <Button
                onClick={handleStart}
                disabled={loading}
                size="lg"
              >
                {loading ? "..." : getLabel('cta_button', language)}
              </Button>
              <p className="text-sm text-muted-foreground">{getLabel('cta_no_card', language)}</p>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-20 border-t bg-muted">
          <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-md border bg-card">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">{getLabel('feature_real_title', language)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {getLabel('feature_real_desc', language)}
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-md border bg-card">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">{getLabel('feature_safe_title', language)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {getLabel('feature_safe_desc', language)}
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-md border bg-card">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">{getLabel('feature_easy_title', language)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {getLabel('feature_easy_desc', language)}
              </p>
            </div>
          </div>
        </section>
      </main>
    </TooltipProvider>
  );
}
