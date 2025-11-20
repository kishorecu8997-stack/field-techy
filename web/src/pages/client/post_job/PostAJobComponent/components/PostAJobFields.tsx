import { interviewerData } from "@/dummy_data/admin/PostAJob";
import { Button } from "@/shared/components/commonUI/Buttons";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { toast } from "react-toastify";
import ClientInterviewerCard from "../client_Interview/ClientInterviewerCard";
import ClientInterviewerSection from "../client_Interview/ClientInterviewerSection";
import BackFills from "./BackFills";
import BasicInfo from "./BasicInfo";
import Budget from "./Budget";
import Languages from "./Languages";
import LocationPage from "./LocationPage";
import OtherDetails from "./OtherDetails";
import Requirements from "./Requirements";
import SchedulingPage from "./SchedulingPage";
[];

const PostAJobFields = () => {
  const { setActiveKey, setISOpenSidebar } = useDrawerStore();
  const { showPopup } = usePopupStore();

  const handleDeleteInterviewer = async (id: number) => {
    await showPopup({
      title: "Delete Client Interviewer",
      body: "Are you sure you want to delete this interviewer?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Delete",
          value: "delete",
          variant: "danger",
          action: async (close) => {
            close(true);
            toast.success("client interviewer deleted successfully");
          },
        },
      ],
    });
  };

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
        {interviewerData.length ? (
          <ClientInterviewerSection
            composeDetails={(client) => [
              { label: "First Name", value: client.firstName },
              { label: "Last Name", value: client.lastName },
              { label: "Email ID", value: client.email },
              { label: "Mobile Number", value: client.mobile },
              { section: "Interview Schedule Info" },
              { label: "Available Date", value: client.startDate },
              { label: "Available Time", value: client.startTime },
            ]}
            interviewers={interviewerData}
            onAdd={() => {
              setActiveKey("clientInterviewer");
              setISOpenSidebar(true);
            }}
            onEdit={() => {
              setActiveKey("editClientInterviewer");
              setISOpenSidebar(true);
            }}
            onDelete={handleDeleteInterviewer}
          />
        ) : (
          <ClientInterviewerCard />
        )}
      </div>
    </div>
  );
};

export default PostAJobFields;
