import type { Metadata } from "next";

import {
  Cormorant_Garamond,
  Geist,
  Noto_Naskh_Arabic,
} from "next/font/google";

import { getLocale, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

import "./globals.css";

import { cn } from "@/lib/utils";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-naskh",
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={direction}
      className={cn(
        "h-full",
        geist.variable,
        cormorantGaramond.variable,
        notoNaskhArabic.variable,
        "font-sans",
        "antialiased"
      )}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}