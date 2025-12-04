import { workTypes } from "@/dummy_data/client";
import { RadioField } from "@/shared/components/commonUI/inputs/RadioField";
import MapSearch from "@/shared/components/MapWithSearch";
import SectionHeader from "../SectionHeader";

const LocationPage = ({ isDisable }: { isDisable: boolean }) => {
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
        <MapSearch viewOnly={isDisable} />
      </div>
    </div>
  );
};

export default LocationPage;
