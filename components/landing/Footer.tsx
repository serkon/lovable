"use client";

import React from 'react';
import Link from 'next/link';
import { getLabel } from '@/lib/translations';

interface FooterProps {
    language: "tr" | "en";
}

export function Footer({ language }: FooterProps) {
    return (
        <div className="border-t pt-10 mt-10 flex flex-col md:flex-row justify-between items-center gap-6" data-testid="footer-container">
            <div className="text-xs text-muted-foreground opacity-70">
                © {new Date().getFullYear()} SecondSpring. {getLabel('footer_all_rights', language)}
            </div>
            <div className="flex gap-8 text-xs text-muted-foreground opacity-70">
                <Link href="#" className="hover:text-primary transition-colors">{getLabel('footer_privacy', language)}</Link>
                <Link href="#" className="hover:text-primary transition-colors">{getLabel('footer_terms', language)}</Link>
                <Link href="#" className="hover:text-primary transition-colors">{getLabel('footer_help', language)}</Link>
            </div>
        </div>
    );
}
