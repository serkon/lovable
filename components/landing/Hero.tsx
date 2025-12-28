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

                    <div className="flex flex-col items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="relative w-10 h-10 transition-transform hover:scale-110 hover:z-10">
                                        <Image
                                            src={`https://i.pravatar.cc/100?u=${i + 10}`}
                                            alt="user"
                                            fill
                                            className="rounded-full border-2 border-white shadow-md object-cover"
                                        />
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-white shadow-md bg-secondary flex items-center justify-center text-[10px] font-bold text-primary transition-transform hover:scale-110 hover:z-10">
                                    +2K
                                </div>
                            </div>
                            <p className="text-sm font-medium text-muted-foreground leading-tight">
                                {getLabel('join_couples', language)}
                            </p>
                        </div>

                        <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/40 translate-y-2">
                            <div className="flex items-center gap-2">
                                <Shield className="w-3.5 h-3.5 text-green-500/50" />
                                <span>{getLabel('verified_profiles', language)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Lock className="w-3.5 h-3.5 text-primary/40" />
                                <span>{getLabel('secure_data', language)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
