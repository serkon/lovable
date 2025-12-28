"use client";

import Link from "next/link";
import { Heart, Shield, Users, Sparkles, ArrowRight, Star, Headphones, Lock } from "lucide-react";
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
      <main className="min-h-screen bg-background flex flex-col selection:bg-primary/10 selection:text-primary overflow-x-hidden">
        {/* Header */}
        <header className="px-6 h-16 flex justify-between items-center border-b sticky top-0 z-50 bg-white/80 backdrop-blur-xl">
          <Logo size={40} />
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-muted-foreground font-medium">
              {getLabel("already_member", language)}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-semibold px-4">
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
        <section className="flex-1 flex flex-col justify-center items-center py-32 px-6 relative">
          {/* Elite Background Decor */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,var(--primary),transparent_70%)] opacity-[0.04] -z-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[160px] rounded-full -z-10" />

          {/* Atmospheric Elements - Distributed & Varied */}
          <div className="atmosphere-item top-20 left-[5%] animate-float-y slow">
            <Heart className="w-12 h-12" />
          </div>
          <div className="atmosphere-item top-40 left-[15%] animate-float-x fast">
            <Star className="w-6 h-6" />
          </div>
          <div className="atmosphere-item top-[60%] left-[8%] animate-pulse-soft">
            <Heart className="w-8 h-8" />
          </div>
          <div className="atmosphere-item top-32 right-[10%] animate-float-y fast">
            <Star className="w-14 h-14" />
          </div>
          <div className="atmosphere-item top-[50%] right-[5%] animate-float-x slow">
            <Heart className="w-10 h-10" />
          </div>
          <div className="atmosphere-item bottom-20 right-[20%] animate-pulse-soft">
            <Star className="w-8 h-8" />
          </div>
          <div className="atmosphere-item bottom-40 left-[25%] animate-float-y">
            <Heart className="w-14 h-14" />
          </div>

          <div className="max-w-5xl mx-auto text-center space-y-12 relative z-10">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/5 border border-primary/20 text-primary text-sm tracking-wider animate-in fade-in slide-in-from-bottom-3 duration-1000">
              <Sparkles className="w-4 h-4" />
              <span>{language === 'tr' ? 'Gerçek aşkın yaşı yoktur' : 'Real love has no age limit'}</span>
            </div>

            <h1 className="leading-[1.05] animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-150">
              {language === 'tr' ? (
                <>Hayatın <span className="text-emphasized">İkinci Baharı</span><br className="hidden sm:block" /> Sizi Bekliyor</>
              ) : (
                <>Your <span className="text-emphasized">Second Spring</span><br className="hidden sm:block" /> is Waiting</>
              )}
            </h1>

            <p className="tracking-tight max-w-xl mx-auto text-muted-foreground text-xl animate-in fade-in slide-in-from-bottom-7 duration-1000 delay-300">
              {getLabel('hero_subtitle', language)}
            </p>

            <div className="flex flex-col items-center justify-center gap-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
              <Button
                onClick={handleStart}
                disabled={loading}
                variant="default"
                size="xl"
                className="font-bold h-14 px-12 text-lg group shadow-2xl shadow-primary/30 hover:shadow-primary/50 active:scale-95 transition-all rounded-full bg-primary hover:bg-primary/90"
              >
                {loading ? "..." : getLabel('cta_button', language)}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>

              <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <img key={i} src={`https://i.pravatar.cc/100?u=${i + 10}`} className="w-10 h-10 rounded-full border-2 border-white shadow-md transition-transform hover:scale-110 hover:z-10" alt="user" />
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-white shadow-md bg-secondary flex items-center justify-center text-[10px] font-bold text-primary transition-transform hover:scale-110 hover:z-10">
                      +2K
                    </div>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground leading-tight">
                    {language === 'tr' ? 'Mutlu çiftler arasına katılın' : 'Join our happy couples'}
                  </p>
                </div>

                <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/40 translate-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-green-500/50" />
                    <span>Verified Profiles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-primary/40" />
                    <span>Secure Data</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-24 border-t bg-white relative">
          <div className="max-w-6xl mx-auto px-6">


            <h2 className="text-center mb-16 text-3xl md:text-5xl font-bold tracking-tight">
              {language === 'tr' ? 'Neden Biz?' : 'Why Choose Us?'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center mb-10">
              {/* Feature 1 - Real People */}
              <div className="space-y-6">
                <div className="w-14 h-14 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto transition-transform hover:scale-110">
                  <Users className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{getLabel('feature_real_title', language)}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed px-4">
                    {getLabel('feature_real_desc', language)}
                  </p>
                </div>
              </div>

              {/* Feature 2 - Safety */}
              <div className="space-y-6">
                <div className="w-14 h-14 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto transition-transform hover:scale-110">
                  <Shield className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{getLabel('feature_safe_title', language)}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed px-4">
                    {getLabel('feature_safe_desc', language)}
                  </p>
                </div>
              </div>

              {/* Feature 3 - Ease of Use */}
              <div className="space-y-6">
                <div className="w-14 h-14 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto transition-transform hover:scale-110">
                  <Heart className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{getLabel('feature_easy_title', language)}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed px-4">
                    {getLabel('feature_easy_desc', language)}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-10 mt-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-xs text-muted-foreground opacity-70">
                © {new Date().getFullYear()} İkinci Bahar. {language === 'tr' ? 'Tüm Hakları Saklıdır.' : 'All Rights Reserved.'}
              </div>
              <div className="flex gap-8 text-xs text-muted-foreground opacity-70">
                <Link href="#" className="hover:text-primary transition-colors">{language === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy'}</Link>
                <Link href="#" className="hover:text-primary transition-colors">{language === 'tr' ? 'Kullanım Şartları' : 'Terms of Service'}</Link>
                <Link href="#" className="hover:text-primary transition-colors">{language === 'tr' ? 'Yardım Merkezi' : 'Help Center'}</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </TooltipProvider>
  );
}
