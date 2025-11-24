/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { MapComponentProps } from "./type";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/* -------SEARCH BAR -------------- */
/**
 * A search bar component that allows users to search for locations using the Nominatim API.
 * It provides suggestions as the user types and allows selecting a location.
 * @param {object} props - The component props.
 * @param {(latlng: L.LatLng, name: string) => void} props.onSelect - Callback function to be called when a location is selected.
 * @returns {React.ReactElement} The rendered search bar component.
 */
const MapSearchBar: React.FC<{
  onSelect: (latlng: L.LatLng, name: string) => void;
}> = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
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
            query
          )}&addressdetails=1&limit=5`
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

  const handleSelect = (place: any) => {
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
            query
          )}&addressdetails=1&limit=1`
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
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setUserTyping(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search location..."
          className="w-full py-2 px-4 border bg-white dark:bg-gray-800 rounded-lg shadow-md text-sm"
        />
        {suggestions.length > 0 && (
          <ul className="absolute mt-1 w-full bg-white dark:bg-gray-800 dark:text-white shadow-lg rounded-md border max-h-56 overflow-y-auto z-[1000]">
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

/* -------------- MAP CLICK HANDLER (DISABLED WHEN viewOnly = true) ------------- */
/**
 * A component that handles map click events.
 * When the map is clicked, it updates the position and calls the onMapClick callback.
 * This handler can be disabled.
 * @param {object} props - The component props.
 * @param {boolean} props.disabled - If true, click events are ignored.
 * @param {(latlng: { lat: number; lng: number }) => void} props.onMapClick - Callback function for map clicks.
 * @param {React.Dispatch<React.SetStateAction<[number, number]>>} props.setPosition - State setter to update the marker's position.
 * @returns {null} This component does not render anything.
 */
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

/* --------------
FLY MAP TO (disabled if viewOnly -------------- */
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

/* -------------- MAIN MAP COMPONENT -------------- */
const MapSearch: React.FC<MapComponentProps> = ({
  initialPosition = [20.5937, 78.9629],
  initialZoom = 5,
  markers = [],
  onMapClick = () => {},
  viewOnly = false,
}) => {
  const [position, setPosition] = useState<[number, number]>(initialPosition);
  const [searchLocation, setSearchLocation] = useState<L.LatLng | null>(null);

  return (
    <div className="relative w-full z-50">
      {/* Hide search bar in viewOnly */}
      {!viewOnly && <MapSearchBar onSelect={setSearchLocation} />}

      <MapContainer
        center={initialPosition}
        zoom={initialZoom}
        zoomControl={!viewOnly}
        dragging={!viewOnly}
        scrollWheelZoom={!viewOnly}
        doubleClickZoom={!viewOnly}
        attributionControl={!viewOnly}
        style={{
          height: "400px",
          width: "100%",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
        }}
      >
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

        {/* Selected / searched marker */}
        <Marker position={position}>
          <Popup>
            Lat: {position[0]}, Lng: {position[1]}
          </Popup>
        </Marker>

        <MapEventHandler
          disabled={viewOnly}
          onMapClick={onMapClick}
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
