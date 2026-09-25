import type { Metadata } from "next";
import {Cormorant_Garamond, Noto_Naskh_Arabic, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const playfair_display = Cormorant_Garamond({
  variable: "--font-playfair",
  subsets: ["latin"],

});

const noto_naskh_arabic = Noto_Naskh_Arabic({
  variable: "--font-naskh",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "Qawl",
  description: "أحيانًا، لا نبحث عن كلماتٍ جديدة؛ بل عن كلماتٍ سبقتنا إلى أعماقنا، وقالت ما عجزنا عن قوله.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", playfair_display.variable, noto_naskh_arabic.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
