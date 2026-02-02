import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { IoLocationSharp } from "react-icons/io5";
import { MAP_DEFAULTS } from "@/shared/constants/mapDefaults";

interface WorkLocationMapProps {
  latitude?: number;
  longitude?: number;
  locationName?: string;
  address?: string;
}

const WorkLocationMap: React.FC<WorkLocationMapProps> = ({
  latitude = MAP_DEFAULTS.latitude,
  longitude = MAP_DEFAULTS.longitude,
  locationName = MAP_DEFAULTS.locationName,
  address = MAP_DEFAULTS.address,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    if (!map.current) {
      map.current = L.map(mapContainer.current).setView(
        [latitude, longitude],
        10
      );

      // Add OpenStreetMap tiles
      L.tileLayer(MAP_DEFAULTS.tileUrl, {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map.current);
    }

    // Clear existing markers
    map.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.current?.removeLayer(layer);
      }
    });

    // Add marker at the location
    const customIcon = L.icon({
      iconUrl: MAP_DEFAULTS.markerIconUrl,
      shadowUrl: MAP_DEFAULTS.markerShadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    L.marker([latitude, longitude], { icon: customIcon })
      .addTo(map.current)
      .bindPopup(`<strong>${locationName}</strong><br/>${address}`);

    // Center map on marker
    map.current.setView([latitude, longitude], 10);

    // Cleanup function to prevent memory leaks
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [latitude, longitude, locationName, address]);

  return (
    <div className="space-y-3 text-sm text-gray-900 dark:text-gray-100">
      <div
        ref={mapContainer}
        className="relative z-0 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm p-4"
        style={{ width: "100%", height: "400px", zIndex: 0 }}
      />
      <div className="flex items-start gap-2 text-gray-900 dark:text-gray-100">
        <IoLocationSharp className="mt-0.5 h-4 w-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
        <div>
          <p className="font-medium">{locationName}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">{address}</p>
        </div>
      </div>
    </div>
  );
};

export default WorkLocationMap;
