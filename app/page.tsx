"use client";

import { useAppStore } from "@/context/AppStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { FAQ } from "@/components/landing/FAQ";

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
      router.push("/onboarding");
    } finally {
      // Keep loading to prevent flicker
    }
  };

  return (
    <main
      data-testid="home-page"
      className="bg-background selection:bg-primary/10 selection:text-primary flex min-h-screen flex-col"
    >
      <Header variant="landing" />
      <Hero language={language} onStart={handleStart} loading={loading} profiles={profiles} />
      <Features language={language} />
      <FAQ language={language} />
    </main>
  );
}
