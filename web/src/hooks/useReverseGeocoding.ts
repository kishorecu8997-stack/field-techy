import { useState, useEffect } from "react";

/**
 * Custom hook to perform reverse geocoding using OpenStreetMap Nominatim API.
 * Converts "lat, lon" strings into human-readable addresses.
 *
 * @param locationString - A string in the format "latitude, longitude"
 * @returns { address: string | null, isLoading: boolean }
 */
export const useReverseGeocoding = (
  locationString: string | null | undefined,
) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!locationString) {
      setAddress(null);
      return;
    }

    const parts = locationString.split(",").map((p) => p.trim());

    // Basic validation: if it doesn't look like "lat, lon", treat it as a literal address
    if (
      parts.length < 2 ||
      isNaN(Number(parts[0])) ||
      isNaN(Number(parts[1]))
    ) {
      setAddress(locationString);
      return;
    }

    const [lat, lon] = parts;

    const fetchLocation = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
          {
            headers: {
              "User-Agent": "field-techy-app",
            },
          },
        );

        if (!res.ok) throw new Error("Failed to fetch location");

        const data = await res.json();
        if (data && data.address) {
          const {
            village,
            state_district,
            state,
            country,
            city,
            suburb,
            town,
          } = data.address;

          // Construct a readable display string
          const displayParts = [
            village || suburb || town || city,
            state_district || state,
            country,
          ].filter(Boolean);

          setAddress(displayParts.join(", "));
        } else {
          setAddress(locationString);
        }
      } catch (error) {
        console.error("Error reverse geocoding location:", error);
        setAddress(locationString); // Fallback to raw coordinates on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocation();
  }, [locationString]);

  return { address, isLoading };
};
