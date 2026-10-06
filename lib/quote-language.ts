type QuoteLanguage = "en" | "ar";

export function getQuoteText(
  quote: {
    text: string;
    textEn: string | null;
    textAr: string | null;
  },
  locale: QuoteLanguage
) {
  if (locale === "ar") {
    return quote.textAr ?? quote.text;
  }

  return quote.textEn ?? quote.text;
}