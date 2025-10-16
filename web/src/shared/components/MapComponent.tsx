/* eslint-disable @typescript-eslint/no-explicit-any */
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import type { MapComponentProps } from "./type";

// Fix default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});



// Handle map clicks and update map view
const MapEventHandler: React.FC<{
  onMapClick: (latlng: { lat: number; lng: number }) => void;
  setPosition: React.Dispatch<React.SetStateAction<[number, number]>>;
}> = ({ onMapClick, setPosition }) => {
  const map = useMap();

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onMapClick(e.latlng);
      // Animate map to clicked location
      map.flyTo([lat, lng], map.getZoom());
    },
  });

  return null;
};

/**
 * MapComponent
 * Renders an interactive map using React Leaflet, displaying markers and handling map click events.
 * @param {MapComponentProps} props - Configuration props including initial position, zoom, markers, and click handler
 * @returns {JSX.Element} The rendered map container element
 */
const MapComponent: React.FC<MapComponentProps> = ({
  initialPosition = [51.505, -0.09],
  initialZoom = 13,
  markers = [],
  onMapClick = () => {},
}) => {
  const [position, setPosition] = useState<[number, number]>(initialPosition);

  return (
    <MapContainer
      center={initialPosition}
      zoom={initialZoom}
      style={{
        height: "400px",
        width: "100%",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        zIndex: 10,
      }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Render provided markers */}
      {markers.map((marker, index) => (
        <Marker key={marker.id ?? index} position={marker.position}>
          <Popup>
            <div style={{ minWidth: "150px" }}>
              <strong>{marker.title || `Marker ${index + 1}`}</strong>
              <br />
              {marker.description && <small>{marker.description}</small>}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Marker at last clicked position */}
      <Marker position={position}>
        <Popup>You clicked here!</Popup>
      </Marker>

      {/* Event handler that also controls map movement */}
      <MapEventHandler onMapClick={onMapClick} setPosition={setPosition} />
    </MapContainer>
  );
};

export default MapComponent;
