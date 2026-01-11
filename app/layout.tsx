"use client";

import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import "./custom.scss";
import { AppProvider } from "@/context/AppStore";
import { Toaster } from "sonner";
import { Footer } from "@/components/layout/Footer";

export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
});

const dm_sans = DM_Sans({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"
          rel="stylesheet"
        />
      </head>
      <body className={`${dm_sans.variable} ${playfair.variable} antialiased`}>
        <AppProvider>
          <div className="flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
