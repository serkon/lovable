"use client";

import { useAppStore } from "@/context/AppStore";
import { createGuestUser } from "@/lib/actions/userActions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

import { getHeroProfiles, HeroProfile } from "@/lib/actions/publicActions";
import { useEffect } from "react";

export default function Home() {
  const { language } = useAppStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState<HeroProfile[]>([]);

  useEffect(() => {
    getHeroProfiles().then(setProfiles);
  }, []);

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
      <main className="min-h-screen bg-background flex flex-col selection:bg-primary/10 selection:text-primary">
        <Header variant="landing" />
        <Hero language={language} onStart={handleStart} loading={loading} profiles={profiles} />

        <Features language={language} />

        <FAQ language={language} />

        <div className="max-w-6xl mx-auto px-6 w-full pb-10">
          <Footer language={language} />
        </div>
      </main>
    </TooltipProvider>
  );
}
