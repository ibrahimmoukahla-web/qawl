"use client";

import { useEffect, useState } from "react";
import { IoLocationOutline } from "react-icons/io5";

type LocationData = {
  city?: string | null;
  region?: string | null;
  country?: string | null;
};

const LOCATION_CACHE_KEY = "qawl-user-location";
const LOCATION_CACHE_TIME = 60 * 60 * 1000; // 1 hour

export default function UserLocation() {
  const [location, setLocation] =
    useState("Detecting...");

  useEffect(() => {
    let mounted = true;

    async function detectLocation() {
      try {
        // =================================================
        // 1. Check localStorage
        // =================================================

        const cached =
          localStorage.getItem(
            LOCATION_CACHE_KEY,
          );

        if (cached) {
          try {
            const parsed = JSON.parse(cached);

            const isValid =
              Date.now() - parsed.timestamp <
              LOCATION_CACHE_TIME;

            if (isValid && parsed.location) {
              if (mounted) {
                setLocation(parsed.location);
              }

              return;
            }
          } catch {
            localStorage.removeItem(
              LOCATION_CACHE_KEY,
            );
          }
        }

        // =================================================
        // 2. Request our own API
        // =================================================

        const response = await fetch(
          "/api/location",
        );

        if (!response.ok) {
          throw new Error(
            "Failed to detect location",
          );
        }

        const data: LocationData =
          await response.json();

        if (!mounted) return;

        // =================================================
        // 3. Choose best location
        // =================================================

        const detectedLocation =
          data.city ||
          data.region ||
          data.country ||
          "Unknown location";

        setLocation(detectedLocation);

        // =================================================
        // 4. Save for 1 hour
        // =================================================

        localStorage.setItem(
          LOCATION_CACHE_KEY,
          JSON.stringify({
            location: detectedLocation,
            timestamp: Date.now(),
          }),
        );
      } catch (error) {
        console.error(
          "Location detection error:",
          error,
        );

        if (mounted) {
          setLocation("Unknown location");
        }
      }
    }

    detectLocation();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <span className="flex min-w-0 items-center gap-1.5">
      <IoLocationOutline
        size={16}
        className="shrink-0"
      />

      <span className="truncate">
        {location}
      </span>
    </span>
  );
}