"use client";

import React from "react";
import Link from "next/link";
import { getLabel } from "@/lib/translations";

interface FooterProps {
  language: "tr" | "en";
}

export function Footer({ language }: FooterProps) {
  return (
    <footer
      className="mt-8 flex flex-col items-center justify-between gap-6 border-t px-12 py-8 md:flex-row"
      data-testid="footer-container"
    >
      <div className="text-muted-foreground text-xs opacity-70">
        © {new Date().getFullYear()} SecondSpring. {getLabel("footer_all_rights", language)}
      </div>
      <div className="text-muted-foreground flex gap-8 text-xs opacity-70">
        <Link href="/privacy" className="hover:text-primary transition-colors">
          {getLabel("footer_privacy", language)}
        </Link>
        <Link href="/terms" className="hover:text-primary transition-colors">
          {getLabel("footer_terms", language)}
        </Link>
        <Link href="#" className="hover:text-primary transition-colors">
          {getLabel("footer_help", language)}
        </Link>
      </div>
    </footer>
  );
}
