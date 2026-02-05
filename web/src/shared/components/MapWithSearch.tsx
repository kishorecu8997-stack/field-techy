import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai"; // Example close icon
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { MapComponentProps } from "./type";

import { Button } from "@/shared/components/commonUI/Buttons";

import { fixLeafletIcon } from "@/utils/leafletSetup";

// Fix default icon issue
fixLeafletIcon();

/* ===========================================================
   DYNAMIC MAP INTERACTION CONTROLLER (IMPORTANT)
   =========================================================== */
const MapInteractionController: React.FC<{ viewOnly: boolean }> = ({
  viewOnly,
}) => {
  const map = useMap();
  const zoomControlRef = useRef<L.Control.Zoom | null>(null);

  useEffect(() => {
    if (!viewOnly && !zoomControlRef.current) {
      const zc = L.control.zoom({ position: "topleft" });
      zc.addTo(map);
      zoomControlRef.current = zc;
    } else if (viewOnly && zoomControlRef.current) {
      zoomControlRef.current.remove();
      zoomControlRef.current = null;
    }

    // Handle interactions
    if (viewOnly) {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      map.touchZoom.disable();
    } else {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
      map.touchZoom.enable();
    }
    return () => {
      if (zoomControlRef.current) {
        zoomControlRef.current.remove();
        zoomControlRef.current = null;
      }
    };
  }, [viewOnly, map]);

  return null;
};

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    [key: string]: string;
  };
}

/* ===========================================================
   SEARCH BAR COMPONENT
   =========================================================== */
const MapSearchBar: React.FC<{
  onSelect: (latlng: L.LatLng, name: string) => void;
}> = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [, setLoading] = useState(false);
  const [userTyping, setUserTyping] = useState(false);

  useEffect(() => {
    if (!userTyping || !query.trim()) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query,
          )}&addressdetails=1&limit=5`,
        );
        const data = await res.json();
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [query, userTyping]);

  const handleSelect = (place: NominatimResult) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);

    onSelect(L.latLng(lat, lon), place.display_name);
    setQuery(place.display_name);
    setSuggestions([]);
    setUserTyping(false);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setUserTyping(false);
      setSuggestions([]);

      if (!query.trim()) return;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query,
          )}&addressdetails=1&limit=1`,
        );
        const data = await res.json();
        if (data && data.length > 0) {
          handleSelect(data[0]);
        } else {
          alert("Location not found");
        }
      } catch {
        alert("Error searching location");
      }
    }
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] md:w-72 xl:w-full max-w-md">
      <div className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setUserTyping(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search location..."
          className="w-full py-2 pl-4 pr-10 border bg-white dark:bg-gray-800 rounded-lg shadow-md text-sm"
        />
        {query && (
          <Button
            type="button"
            onClick={() => {
              setQuery("");
              setSuggestions([]);
              setUserTyping(false);
            }}
            aria-label="Clear search"
            title="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center p-0
              dark:text-white
             hover:text-white-700 dark:hover:text-white-300"
          >
            <AiOutlineClose size={16} /> {/* size optional */}
          </Button>
        )}
        {suggestions.length > 0 && (
          <ul className="absolute mt-1 w-full bg-white dark:bg-gray-800 dark:text-white shadow-lg rounded-md border max-h-56 overflow-y-auto">
            {suggestions.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSelect(item)}
                className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer"
              >
                {item.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

/* ===========================================================
   MAP CLICK HANDLER (RESPECTS viewOnly)
   =========================================================== */
const MapEventHandler: React.FC<{
  disabled: boolean;
  onMapClick: (latlng: { lat: number; lng: number }) => void;
  setPosition: React.Dispatch<React.SetStateAction<[number, number]>>;
}> = ({ disabled, onMapClick, setPosition }) => {
  useMapEvents({
    click(e) {
      if (disabled) return;

      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onMapClick(e.latlng);
    },
  });

  return null;
};

/* ===========================================================
   FLY TO LOCATION (disabled with viewOnly)
   =========================================================== */
const MapFlyTo: React.FC<{
  disabled: boolean;
  location: L.LatLng | null;
  setPosition: React.Dispatch<React.SetStateAction<[number, number]>>;
}> = ({ disabled, location, setPosition }) => {
  const map = useMap();

  useEffect(() => {
    if (location && !disabled) {
      map.flyTo(location, 14);
      setPosition([location.lat, location.lng]);
    }
  }, [location]);

  return null;
};

/* ===========================================================
   MAIN MAP COMPONENT (FULLY UPDATED)
   =========================================================== */
const MapSearch: React.FC<MapComponentProps> = ({
  initialPosition = [20.5937, 78.9629],
  initialZoom = 5,
  markers = [],
  onMapClick = () => {},
  viewOnly = false,
  onPositionChange,
  className,
}) => {
  const [position, setPosition] = useState<[number, number]>(initialPosition);
  const [searchLocation, setSearchLocation] = useState<L.LatLng | null>(null);
  // 🔁 Notify parent whenever position changes
  useEffect(() => {
    if (onPositionChange) {
      onPositionChange(position);
    }
  }, [position, onPositionChange]);

  // Handle search selection
  const handleSearchSelect = (latlng: L.LatLng) => {
    const newPos: [number, number] = [latlng.lat, latlng.lng];
    setPosition(newPos);
    setSearchLocation(latlng);
  };

  // Handle map click
  const handleMapClick = (latlng: { lat: number; lng: number }) => {
    // console.log("latlng :", latlng);
    const newPos: [number, number] = [latlng.lat, latlng.lng];
    setPosition(newPos);
    onMapClick(latlng);
  };

  return (
    <div className={`relative w-full z-0 ${className}`}>
      {/* Hide search bar in viewOnly */}
      {!viewOnly && <MapSearchBar onSelect={handleSearchSelect} />}

      <MapContainer
        center={initialPosition}
        zoom={initialZoom}
        zoomControl={false}
        dragging={!viewOnly}
        scrollWheelZoom={!viewOnly}
        doubleClickZoom={!viewOnly}
        attributionControl={!viewOnly}
        style={{
          zIndex: 1,
          height: "400px",
          width: "100%",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
        }}
      >
        <MapInteractionController viewOnly={viewOnly} />

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {markers.map((marker, index) => (
          <Marker key={marker.id ?? index} position={marker.position}>
            <Popup>
              <strong>{marker.title || `Marker ${index + 1}`}</strong>
              <br />
              {marker.description}
            </Popup>
          </Marker>
        ))}

        <Marker position={position}>
          <Popup>
            Lat: {position[0]}, Lng: {position[1]}
          </Popup>
        </Marker>

        <MapEventHandler
          disabled={viewOnly}
          onMapClick={(data: { lat: number; lng: number }) => {
            handleMapClick({ lat: data.lat, lng: data.lng });
          }}
          setPosition={setPosition}
        />

        {searchLocation && (
          <MapFlyTo
            disabled={viewOnly}
            location={searchLocation}
            setPosition={setPosition}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapSearch;
