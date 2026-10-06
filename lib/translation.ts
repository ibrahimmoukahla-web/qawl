import { GoogleGenAI } from "@google/genai";

// =========================================================
// TYPES
// =========================================================

type SupportedLanguage = "en" | "ar";

type TranslationResult = {
  textEn: string;
  textAr: string;
  sourceLanguage: SupportedLanguage;
};

type AuthorTranslation = {
  nameEn: string;
  nameAr: string;
  bioEn: string | null;
  bioAr: string | null;
};

type CategoryTranslation = {
  nameEn: string;
  nameAr: string;
};

type TagTranslation = {
  nameEn: string;
  nameAr: string;
};

// =========================================================
// MODELS
// =========================================================

const PRIMARY_MODEL = process.env.GEMINI_MODEL ?? "gemini-3.8-flash";

const FALLBACK_MODEL =
  process.env.GEMINI_FALLBACK_MODEL ?? "gemini-3.5-flash-lite";

const MAX_RETRIES = 3;

// =========================================================
// GEMINI CLIENT
// =========================================================

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing from environment variables.");
  }

  return new GoogleGenAI({
    apiKey,
  });
}

// =========================================================
// SLEEP
// =========================================================

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// =========================================================
// GET ERROR STATUS
// =========================================================

function getErrorStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null) {
    return undefined;
  }

  if ("status" in error && typeof error.status === "number") {
    return error.status;
  }

  return undefined;
}

// =========================================================
// RETRYABLE ERRORS
// =========================================================

function isRetryableError(error: unknown) {
  const status = getErrorStatus(error);

  return status === 429 || status === 500 || status === 503 || status === 504;
}

// =========================================================
// GENERATE WITH RETRY
// =========================================================

async function generateTranslation(
  ai: GoogleGenAI,
  model: string,
  prompt: string,
) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(
        `Gemini translation attempt ${attempt}/${MAX_RETRIES} using ${model}`,
      );

      const response = await ai.models.generateContent({
        model,
        contents: prompt,

        config: {
          temperature: 0.2,
          responseMimeType: "application/json",
         
        },
      });

      return response;
    } catch (error) {
      lastError = error;

      const status = getErrorStatus(error);

      console.error(`Gemini error on attempt ${attempt}:`, {
        status,
        error,
      });

      if (!isRetryableError(error) || attempt === MAX_RETRIES) {
        break;
      }

      const delay = 1000 * Math.pow(2, attempt - 1);

      await sleep(delay);
    }
  }

  throw lastError;
}

// =========================================================
// GENERATE JSON WITH PRIMARY + FALLBACK
// =========================================================

async function generateJSON(prompt: string): Promise<Record<string, unknown>> {
  const ai = getGeminiClient();

  let response;

  // =======================================================
  // PRIMARY
  // =======================================================

  try {
    response = await generateTranslation(ai, PRIMARY_MODEL, prompt);
  } catch (primaryError) {
    console.warn(`Primary Gemini model failed: ${PRIMARY_MODEL}`, primaryError);

    // =====================================================
    // FALLBACK
    // =====================================================

    try {
      console.log(`Trying fallback Gemini model: ${FALLBACK_MODEL}`);

      response = await generateTranslation(ai, FALLBACK_MODEL, prompt);
    } catch (fallbackError) {
      console.error(
        `Fallback Gemini model failed: ${FALLBACK_MODEL}`,
        fallbackError,
      );

      throw new Error(
        "The translation service is temporarily unavailable. Please try again in a moment.",
      );
    }
  }

  // =======================================================
  // READ RESPONSE
  // =======================================================

  const rawText = response.text?.trim();

  if (!rawText) {
    throw new Error("Gemini returned an empty response.");
  }

  // =======================================================
  // PARSE JSON
  // =======================================================

  let parsed: unknown;

  try {
    parsed = JSON.parse(rawText);
  } catch (error) {
    console.error("Invalid Gemini JSON response:", {
      rawText,
      error,
    });

    throw new Error("Gemini returned invalid translation data.");
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("Gemini returned invalid translation data.");
  }

  return parsed as Record<string, unknown>;
}

// =========================================================
// TRANSLATE QUOTE
// =========================================================

export async function translateQuote(text: string): Promise<TranslationResult> {
  const cleanText = text.trim();

  if (!cleanText) {
    throw new Error("Quote text is required.");
  }

  const ai = getGeminiClient();

  const prompt = `
You are a professional English-Arabic literary translator
for a philosophical quote platform called Qawl.

Your task:

1. Detect whether the quote is written in English or Arabic.
2. Return the detected source language as "en" or "ar".
3. Preserve the exact original meaning.
4. Preserve the philosophical, literary, emotional, and poetic tone.
5. Do not explain the quote.
6. Do not add information.
7. Do not remove information.
8. If the source is English:
   - Keep the original unchanged in textEn.
   - Translate it naturally into Arabic in textAr.
9. If the source is Arabic:
   - Keep the original unchanged in textAr.
   - Translate it naturally into English in textEn.
10. Return ONLY valid JSON.

Required JSON format:

{
  "sourceLanguage": "en",
  "textEn": "English version",
  "textAr": "Arabic version"
}

Quote:

${cleanText}
  `.trim();

  let response;

  // =======================================================
  // PRIMARY
  // =======================================================

  try {
    response = await generateTranslation(ai, PRIMARY_MODEL, prompt);
  } catch (primaryError) {
    console.warn(`Primary Gemini model failed: ${PRIMARY_MODEL}`, primaryError);

    // =====================================================
    // FALLBACK
    // =====================================================

    try {
      console.log(`Trying fallback Gemini model: ${FALLBACK_MODEL}`);

      response = await generateTranslation(ai, FALLBACK_MODEL, prompt);
    } catch (fallbackError) {
      console.error(
        `Fallback Gemini model failed: ${FALLBACK_MODEL}`,
        fallbackError,
      );

      throw new Error(
        "The translation service is temporarily unavailable. Please try creating the quote again in a moment.",
      );
    }
  }

  // =======================================================
  // READ RESPONSE
  // =======================================================

  const rawText = response.text?.trim();

  if (!rawText) {
    throw new Error("Gemini returned an empty translation.");
  }

  // =======================================================
  // PARSE JSON
  // =======================================================

  let parsed: unknown;

  try {
    parsed = JSON.parse(rawText);
  } catch (error) {
    console.error("Invalid Gemini JSON response:", {
      rawText,
      error,
    });

    throw new Error("Gemini returned invalid translation data.");
  }

  // =======================================================
  // VALIDATE OBJECT
  // =======================================================

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("Gemini returned invalid translation data.");
  }

  const result = parsed as Partial<TranslationResult>;

  // =======================================================
  // VALIDATE LANGUAGE
  // =======================================================

  if (result.sourceLanguage !== "en" && result.sourceLanguage !== "ar") {
    throw new Error("Gemini returned an invalid source language.");
  }

  // =======================================================
  // VALIDATE TRANSLATIONS
  // =======================================================

  if (typeof result.textEn !== "string" || typeof result.textAr !== "string") {
    throw new Error("Gemini returned incomplete translation data.");
  }

  const textEn =
    result.sourceLanguage === "en" ? cleanText : result.textEn.trim();

  const textAr =
    result.sourceLanguage === "ar" ? cleanText : result.textAr.trim();

  if (!textEn) {
    throw new Error("English translation is empty.");
  }

  if (!textAr) {
    throw new Error("Arabic translation is empty.");
  }

  return {
    textEn,
    textAr,
    sourceLanguage: result.sourceLanguage,
  };
}

// =========================================================
// TRANSLATE AUTHOR
// =========================================================

export async function translateAuthor({
  name,
  bio,
}: {
  name: string;
  bio?: string | null;
}): Promise<AuthorTranslation> {
  const cleanName = name.trim();

  const cleanBio = bio?.trim() || null;

  if (!cleanName) {
    throw new Error("Author name is required.");
  }

  const result = await generateJSON(
    `
You are a professional English-Arabic translator
working for Qawl, a philosophical quote platform.

Translate this author information between English and Arabic.

Rules:
- Detect the source language.
- Preserve the author's identity.
- For person names, use natural transliteration rather than translating the person's meaning.
- Preserve the meaning and tone of the biography.
- Do not invent facts.
- Do not add information.
- If biography is empty, return null for both biographies.
- Return ONLY valid JSON.

Required format:

{
  "nameEn": "...",
  "nameAr": "...",
  "bioEn": "...",
  "bioAr": "..."
}

Author name:
${cleanName}

Author biography:
${cleanBio ?? ""}
    `.trim(),
  );

  const nameEn = typeof result.nameEn === "string" ? result.nameEn.trim() : "";

  const nameAr = typeof result.nameAr === "string" ? result.nameAr.trim() : "";

  const bioEn = typeof result.bioEn === "string" ? result.bioEn.trim() : null;

  const bioAr = typeof result.bioAr === "string" ? result.bioAr.trim() : null;

  if (!nameEn || !nameAr) {
    throw new Error("Gemini returned incomplete author translation.");
  }

  return {
    nameEn,
    nameAr,
    bioEn: bioEn || null,
    bioAr: bioAr || null,
  };
}

// =========================================================
// TRANSLATE CATEGORY
// =========================================================

export async function translateCategory(
  name: string,
): Promise<CategoryTranslation> {
  const cleanName = name.trim();

  if (!cleanName) {
    throw new Error("Category name is required.");
  }

  const result = await generateJSON(
    `
You are a professional English-Arabic translator
for the Qawl philosophical quote platform.

Translate this category name between English and Arabic.

Rules:
- Detect the source language.
- Use a natural category name, not a literal awkward translation.
- Preserve the intended meaning.
- Keep it concise because this is a category label.
- Return ONLY valid JSON.

Required format:

{
  "nameEn": "...",
  "nameAr": "..."
}

Category:
${cleanName}
    `.trim(),
  );

  const nameEn = typeof result.nameEn === "string" ? result.nameEn.trim() : "";

  const nameAr = typeof result.nameAr === "string" ? result.nameAr.trim() : "";

  if (!nameEn || !nameAr) {
    throw new Error("Gemini returned incomplete category translation.");
  }

  return {
    nameEn,
    nameAr,
  };
}

// =========================================================
// TRANSLATE TAG
// =========================================================

export async function translateTag(name: string): Promise<TagTranslation> {
  const cleanName = name.trim();

  if (!cleanName) {
    throw new Error("Tag name is required.");
  }

  const result = await generateJSON(
    `
You are a professional English-Arabic translator
for Qawl.

Translate this tag between English and Arabic.

Rules:
- Detect the source language.
- Keep the translation short and natural.
- Preserve the intended meaning.
- Do not add explanations.
- Do not invent meaning.
- Return ONLY valid JSON.

Required format:

{
  "nameEn": "...",
  "nameAr": "..."
}

Tag:
${cleanName}
    `.trim(),
  );

  const nameEn = typeof result.nameEn === "string" ? result.nameEn.trim() : "";

  const nameAr = typeof result.nameAr === "string" ? result.nameAr.trim() : "";

  if (!nameEn || !nameAr) {
    throw new Error("Gemini returned incomplete tag translation.");
  }

  return {
    nameEn,
    nameAr,
  };
}
