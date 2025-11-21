import MapComponent from "@/shared/components/MapComponent";
import SectionHeader from "../SectionHeader";
import { RadioField } from "@/shared/components/commonUI/inputs/RadioField";

const LocationPage = ({ isDisable }: { isDisable: boolean }) => {
  return (
    <div>
      <SectionHeader title="Location" />
      <RadioField
        label="Location Type"
        name="locationType"
        disabled={isDisable}
        direction="horizontal"
        options={[
          { label: "Remote", value: "remote" },
          { label: "On-site", value: "on-site" },
        ]}
      />
      <div className="space-y-2">
        <p> Work Location</p>
        <MapComponent />
      </div>
    </div>
  );
};

export default LocationPage;
