import { NextResponse } from "next/server";
import { headers } from "next/headers";

type IpResponse = {
  ip?: string;
};

type LocationResponse = {
  city?: string;
  region?: string;
  country?: string;
  country_code?: string;
};

export async function GET() {
  try {
    const requestHeaders = await headers();

    // =====================================================
    // 1. Get user's IP from proxy headers
    // =====================================================

    const forwardedFor = requestHeaders.get("x-forwarded-for");
    const realIp = requestHeaders.get("x-real-ip");

    let ip =
      forwardedFor?.split(",")[0]?.trim() ||
      realIp ||
      "";

    // =====================================================
    // 2. If running locally, get public IP
    // =====================================================

    if (
      !ip ||
      ip === "127.0.0.1" ||
      ip === "::1" ||
      ip.startsWith("192.168.") ||
      ip.startsWith("10.") ||
      ip.startsWith("172.16.")
    ) {
      const ipResponse = await fetch(
        "https://api.ip.sb/jsonip",
        {
          cache: "no-store",
        },
      );

      if (ipResponse.ok) {
        const ipData: IpResponse =
          await ipResponse.json();

        ip = ipData.ip || "";
      }
    }

    // =====================================================
    // 3. Ask IP.SB for location
    // =====================================================

    const locationUrl = ip
      ? `https://api.ip.sb/geoip/${ip}`
      : "https://api.ip.sb/geoip";

    const locationResponse = await fetch(
      locationUrl,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!locationResponse.ok) {
      throw new Error(
        `IP.SB returned ${locationResponse.status}`,
      );
    }

    const data: LocationResponse =
      await locationResponse.json();

    // =====================================================
    // 4. Return location
    // =====================================================

    return NextResponse.json({
      city: data.city ?? null,
      region: data.region ?? null,
      country: data.country ?? null,
      countryCode: data.country_code ?? null,
    });
  } catch (error) {
    console.error("Location API error:", error);

    return NextResponse.json({
      city: null,
      region: null,
      country: null,
      countryCode: null,
    });
  }
}