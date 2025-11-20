import { Button } from "@/shared/components/commonUI/Buttons";
import ClientInterviewerCard from "../client_Interview/ClientInterviewerCard";
import BackFills from "./BackFills";
import BasicInfo from "./BasicInfo";
import Budget from "./Budget";
import Languages from "./Languages";
import LocationPage from "./LocationPage";
import OtherDetails from "./OtherDetails";
import Requirements from "./Requirements";
import SchedulingPage from "./SchedulingPage";

const PostAJobFields = () => {
  return (
    <div className="flex gap-4 flex-row p-2">
      <div className="w-2/3 space-y-2">
        <BasicInfo />
        <LocationPage />
        <SchedulingPage />
        <Requirements />
        <BackFills />
        <Budget />
        <Languages />
        <OtherDetails />
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" className="rounded-full">
            Cancel
          </Button>
          <Button className="rounded-full">Review Job Posting</Button>
        </div>
      </div>
      <div className="w-1/3">
        <ClientInterviewerCard />
      </div>
    </div>
  );
};

export default PostAJobFields;
