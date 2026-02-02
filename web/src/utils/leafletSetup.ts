import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const iconFixedMap = new WeakMap<typeof L.Icon.Default.prototype, boolean>();
export const fixLeafletIcon = () => {
  const proto = L.Icon.Default.prototype;
  if (iconFixedMap.get(proto)) return;
  // Fix default icon issue (use 'any' only here)
  delete (proto as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  });
  iconFixedMap.set(proto, true);
};
