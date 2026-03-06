import { workTypes } from "@/dummy_data/client";
import { RadioField } from "@/shared/components/commonUI/inputs/RadioField";
import MapSearch from "@/shared/components/MapWithSearch";
import SectionHeader from "../SectionHeader";
import { useFormContext } from "react-hook-form";
import type { PostAJobFieldsProps } from "../../types";

/*
 *  Location
 *    - Displays a form to add location
 * @returns {JSX.Element} The rendered Location
 * @constructor
 */
const LocationPage = ({ isDisable }: { isDisable: boolean }) => {
  const { setValue } = useFormContext<PostAJobFieldsProps>();

  const handlePositionChange = (position: [number, number]) => {
    setValue("workLocationLat", position[0], { shouldDirty: true });
    setValue("workLocationLng", position[1], { shouldDirty: true });
  };

  const handleSearchSelect = (
    _latlng: { lat: number; lng: number },
    name: string,
  ) => {
    setValue("workLocationName", name, { shouldDirty: true });
  };

  return (
    <div>
      <SectionHeader title="Location" />
      <RadioField
        label="Location Type"
        name="locationType"
        disabled={isDisable}
        required
        direction="horizontal"
        options={workTypes}
      />
      <div className="space-y-2">
        <p> Work Location</p>
        <MapSearch
          viewOnly={isDisable}
          onPositionChange={handlePositionChange}
          onMapClick={(latlng, name) => {
            setValue("workLocationLat", latlng.lat, { shouldDirty: true });
            setValue("workLocationLng", latlng.lng, { shouldDirty: true });
            setValue("workLocationName", name, { shouldDirty: true });
          }}
          onSearchSelect={handleSearchSelect}
        />
      </div>
    </div>
  );
};

export default LocationPage;
