"use client";

import React from 'react';
import { Users, Shield, Heart } from "lucide-react";
import { getLabel } from "@/lib/translations";

interface FeaturesProps {
    language: "tr" | "en";
}

export function Features({ language }: FeaturesProps) {
    return (
        <section id="why-us" className="py-24 border-y bg-slate-50 relative scroll-mt-16">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-center mb-16 text-3xl md:text-5xl font-bold tracking-tight">
                    {getLabel('nav_why_us', language)}
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
            </div>
        </section>
    );
}
