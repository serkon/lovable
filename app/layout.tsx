import type { Metadata } from "next";
import { Inter, Merriweather, Playfair_Display } from "next/font/google";
import "./globals.css";
import "./custom.scss";
import { AppProvider } from "@/context/AppStore";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-serif",
});

export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Next Chapter - 40+ Tanışma Platformu",
  description: "Ciddi ve güvenilir arkadaşlıklar için doğru yerdesiniz.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} ${merriweather.variable} ${playfair.variable} font-sans antialiased`}>
        <AppProvider>
          {children}
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
