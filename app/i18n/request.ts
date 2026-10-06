import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();

  const locale =
    cookieStore.get("NEXT_LOCALE")?.value === "ar"
      ? "ar"
      : "en";

  const messages =
    locale === "ar"
      ? (await import("../messages/ar.json")).default
      : (await import("../messages/en.json")).default;

  return {
    locale,
    messages,
  };
});