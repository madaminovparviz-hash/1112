import type { Metadata } from "next";
import { Lora, Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

/**
 * Fonts with Cyrillic subsets — required for Russian (default) and
 * Tajik (Cyrillic) text. Lora — warm serif for headings; Nunito —
 * friendly rounded sans for body text, legible at 16px+.
 */
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Церковь «Надежда» — Адвентисты Седьмого дня в Душанбе",
  description:
    "Приходите знакомиться: богослужения каждую Субботу (9:30 и 11:00), уроки Субботней школы, проповеди, молитвенная поддержка и тёплая община в Душанбе.",
  keywords: ["адвентисты", "церковь", "Душанбе", "Суббота", "Субботняя школа", "молитва"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${lora.variable} ${nunito.variable} font-sans antialiased bg-background text-foreground min-h-screen`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
