import { interviewerData, pointOfContent } from "@/dummy_data/admin/PostAJob";
import { Button } from "@/shared/components/commonUI/Buttons";
import { usePopupStore } from "@/shared/store/popupStore";
import usePostAJobStore, {
  CurrentLocation,
} from "@/shared/store/postAJobStore";
import useDrawerStore from "@/shared/store/useDrawerStore";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import ClientInterviewerCard from "../client_Interview/ClientInterviewerCard";
import ClientInterviewerSection from "../client_Interview/ClientInterviewerSection";
import PointOfContentPage from "../client_Interview/PointOfContentPage";
import BackFills from "./BackFills";
import BasicInfo from "./BasicInfo";
import Budget from "./Budget";
import Languages from "./Languages";
import LocationPage from "./LocationPage";
import OtherDetails from "./OtherDetails";
import Requirements from "./Requirements";
import SchedulingPage from "./SchedulingPage";
import { absoluteUrls } from "@/config/urls";
import { useNavigate } from "react-router-dom";
import { scrollToTop } from "@/utils";

const PostAJobFields = ({
  setIsDisable,
  isDisable,
}: {
  setIsDisable: Dispatch<SetStateAction<boolean>>;
  isDisable: boolean;
}) => {
  const { setActiveKey, setISOpenSidebar } = useDrawerStore();
  const { currentLocation } = usePostAJobStore();
  const { showPopup } = usePopupStore();
  const navigate = useNavigate();

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

  const pointOfContactSection = pointOfContent.map((item) => ({
    title: `Point of Contact`,
    items: [
      { label: "First Name", value: item.firstName },
      { label: "Last Name", value: item.lastName },
      { label: "Email ID", value: item.email },
      { label: "Mobile Number", value: item.mobile },
      { label: "Contact Type", value: item.contactType },
    ],
    onEdit: () => {
      setActiveKey("editPointOfContent");
      setISOpenSidebar(true);
    },
    onDelete: () => handleDeleteInterviewer(item.id),
  }));

  const interviewerValue = interviewerData.map((item) => ({
    title: `Client Interviewer`,
    items: [
      { label: "First Name", value: item.firstName },
      { label: "Last Name", value: item.lastName },
      { label: "Email ID", value: item.email },
      { label: "Mobile Number", value: item.mobile },
      { label: "Available Date", value: item.startDate },
      { label: "Available Time", value: item.startTime },
    ],
    onEdit: () => {
      setActiveKey("editClientInterviewer");
      setISOpenSidebar(true);
    },
    onDelete: () => handleDeleteInterviewer(Number(item.id)),
  }));
  return (
    <div className="flex gap-4 flex-row p-2">
      <div className="w-2/3 space-y-2">
        <BasicInfo isDisable={isDisable} />
        <LocationPage isDisable={isDisable} />
        <SchedulingPage isDisable={isDisable} />
        <Requirements isDisable={isDisable} />
        <BackFills isDisable={isDisable} />
        <Budget isDisable={isDisable} />
        <Languages isDisable={isDisable} />
        <OtherDetails isDisable={isDisable} />
        <div className="flex justify-end gap-2 mt-2">
          <Button
            isScrollToTop
            variant="outline"
            className="rounded-full"
            onClick={() => {
              navigate(absoluteUrls.client.home.my_jobs);
            }}
          >
            Cancel
          </Button>
          <Button
            isScrollToTop
            onClick={() => {
              setIsDisable(true);
            }}
            className="rounded-full"
          >
            Review Job Posting
          </Button>
        </div>
      </div>

      <div className="w-1/3">
        {currentLocation === CurrentLocation.dedicated ? (
          <>
            {interviewerData.length ? (
              <ClientInterviewerSection
                disabled={isDisable}
                title="Client Interviewer"
                sections={interviewerValue}
                addAction={
                  <Button
                    onClick={() => {
                      setActiveKey("clientInterviewer");
                      setISOpenSidebar(true);
                    }}
                    className="rounded-full"
                  >
                    Add Point of Content
                  </Button>
                }
              />
            ) : (
              <ClientInterviewerCard />
            )}
          </>
        ) : (
          <>
            {pointOfContent.length ? (
              <ClientInterviewerSection
                disabled={isDisable}
                sections={pointOfContactSection}
                title="Point Of Content"
                addAction={
                  <Button
                    onClick={() => {
                      setActiveKey("addPointOfContent");
                      setISOpenSidebar(true);
                    }}
                    className="rounded-full"
                  >
                    Add Point of Content
                  </Button>
                }
              />
            ) : (
              <PointOfContentPage />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PostAJobFields;
