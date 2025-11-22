import MapComponent from "@/shared/components/MapComponent";
import SectionHeader from "../SectionHeader";
import { RadioField } from "@/shared/components/commonUI/inputs/RadioField";
import { workTypes } from "@/dummy_data/client";

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
        <MapComponent />
      </div>
    </div>
  );
};

export default LocationPage;
