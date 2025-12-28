"use client";

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from "lucide-react";
import { getLabel } from "@/lib/translations";
import { cn } from "@/lib/utils";

interface FAQProps {
    language: "tr" | "en";
}

export function FAQ({ language }: FAQProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(1);

    const faqs = [
        { q: getLabel('faq_q1', language), a: getLabel('faq_a1', language) },
        { q: getLabel('faq_q2', language), a: getLabel('faq_a2', language) },
        { q: getLabel('faq_q3', language), a: getLabel('faq_a3', language) },
        { q: getLabel('faq_q4', language), a: getLabel('faq_a4', language) },
    ];

    return (
        <section id="faq" className="py-20 relative scroll-mt-24">
            <div className="max-w-3xl mx-auto px-6">
                <div className="flex flex-col items-center text-center mb-16 space-y-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-2">
                        <HelpCircle className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
                        {getLabel('faq_title', language)}
                    </h2>
                    <div className="h-1 w-12 bg-primary/20 rounded-full" />
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={cn(
                                "group border rounded-2xl transition-all duration-300 bg-white shadow-2xs overflow-hidden",
                                openIndex === index ? "border-primary/30 ring-4 ring-primary/5" : "hover:border-neutral-300"
                            )}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-5 py-4 text-left flex justify-between items-center gap-4"
                            >
                                <span className={cn(
                                    "font-semibold text-[15px] transition-colors",
                                    openIndex === index ? "text-primary" : "text-neutral-700 group-hover:text-neutral-900"
                                )}>
                                    {faq.q}
                                </span>
                                <div className={cn(
                                    "w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center transition-all duration-300 flex-shrink-0",
                                    openIndex === index ? "bg-primary text-white border-primary rotate-180" : "bg-neutral-50 text-neutral-400"
                                )}>
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            </button>

                            <div className={cn(
                                "overflow-hidden transition-all duration-300 ease-in-out",
                                openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                            )}>
                                <div className="px-6 pb-6 text-neutral-600 text-sm leading-relaxed border-t border-neutral-50 pt-4">
                                    {faq.a}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
