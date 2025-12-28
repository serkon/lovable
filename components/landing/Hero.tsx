"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, Star, Sparkles, ArrowRight, Shield, Lock } from "lucide-react";
import { getLabel } from "@/lib/translations";
import Image from "next/image";

interface HeroProps {
    language: "tr" | "en";
    onStart: () => void;
    loading?: boolean;
}

const HERO_PROFILES = [
    { img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2", name: "Ayşe", age: 45, loc: "İstanbul" },
    { img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d", name: "Mehmet", age: 52, loc: "Ankara" },
    { img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330", name: "Zeynep", age: 48, loc: "İzmir" },
    { img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d", name: "Ali", age: 55, loc: "Bursa" },
    { img: "https://images.unsplash.com/photo-1580489944761-15a19d654956", name: "Fatma", age: 42, loc: "Antalya" },
    { img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e", name: "Can", age: 50, loc: "Muğla" },
    { img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80", name: "Elif", age: 46, loc: "İstanbul" },
    { img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e", name: "Hasan", age: 58, loc: "İzmir" },
];

export function Hero({ language, onStart, loading }: HeroProps) {
    return (
        <section className="flex-1 flex flex-col justify-center items-center py-32 px-6 relative overflow-hidden">
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
            <div className="atmosphere-item top-[60%] left-[4%] animate-pulse-soft">
                <Heart className="w-8 h-8" />
            </div>
            <div className="atmosphere-item top-32 right-[10%] animate-float-y fast">
                <Star className="w-14 h-14" />
            </div>
            <div className="atmosphere-item top-[50%] right-[3%] animate-float-x slow">
                <Heart className="w-10 h-10" />
            </div>
            <div className="atmosphere-item bottom-10 right-[15%] animate-pulse-soft">
                <Star className="w-8 h-8" />
            </div>
            <div className="atmosphere-item bottom-12 left-[10%] animate-float-y">
                <Heart className="w-14 h-14" />
            </div>

            <div className="max-w-5xl mx-auto text-center space-y-12 relative z-10">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/5 border border-primary/20 text-primary text-sm tracking-wider animate-in fade-in slide-in-from-bottom-3 duration-1000">
                    <Sparkles className="w-4 h-4" />
                    <span>{getLabel('hero_badge', language)}</span>
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
                        onClick={onStart}
                        disabled={loading}
                        variant="default"
                        size="xl"
                        className="font-bold h-14 px-12 text-lg group shadow-2xl shadow-primary/30 hover:shadow-primary/50 active:scale-95 transition-all rounded-full bg-primary hover:bg-primary/90"
                    >
                        {loading ? "..." : getLabel('cta_button', language)}
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                    </Button>
                    {/* Infinite Marquee of Profiles - "Butterfly Effect" */}
                    <div className="w-full max-w-[90vw] overflow-hidden relative mt-12 mask-linear-fade py-6 -my-6">
                        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

                        <div className="flex gap-4 animate-scroll hover:pause w-max">
                            {/* Duplicate the list to ensure seamless looping */}
                            {[...HERO_PROFILES, ...HERO_PROFILES].map((profile, idx) => (
                                <div
                                    key={idx}
                                    className="relative w-40 h-56 md:w-48 md:h-64 rounded-2xl overflow-hidden shrink-0 border-4 border-white shadow-lg bg-muted group cursor-pointer"
                                >
                                    <Image
                                        src={profile.img}
                                        alt="Member"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 p-3 bg-white/60 backdrop-blur-md border-t border-white/30 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                        <p className="font-bold text-sm text-slate-900 leading-tight">{profile.name}, {profile.age}</p>
                                        <p className="text-[10px] font-semibold text-slate-700 uppercase tracking-wide mt-0.5">{profile.loc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-6 mt-4">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
                            <Shield className="w-3.5 h-3.5 text-green-500" />
                            <span>{getLabel('verified_profiles', language)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
                            <Lock className="w-3.5 h-3.5 text-primary" />
                            <span>{getLabel('secure_data', language)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
