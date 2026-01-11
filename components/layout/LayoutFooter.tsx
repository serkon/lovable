"use client";

import { Footer } from "@/components/landing/Footer";
import { useAppStore } from "@/context/AppStore";
import { usePathname } from "next/navigation";

export function LayoutFooter() {
  const { language } = useAppStore();
  const pathname = usePathname();

  // Hide footer on authentication pages
  const hideFooter =
    pathname === "/login" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname?.startsWith("/reset-password/");

  if (hideFooter) {
    return null;
  }

  return <Footer language={language} />;
}
