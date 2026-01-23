import { absoluteUrls } from "@/config/urls";
import {
  interviewerData,
  pointOfContactData,
} from "@/dummy_data/admin/post_a_Job";
import { Button } from "@/shared/components/commonUI/Buttons";
import { usePopupStore } from "@/shared/store/popupStore";
import usePostAJobStore, {
  CurrentLocation,
} from "@/shared/store/postAJobStore";
import useDrawerStore from "@/shared/store/useDrawerStore";
import type { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ClientInterviewerCard from "../client_Interview/ClientInterviewerCard";
import ClientInterviewerSection from "../client_Interview/ClientInterviewerSection";
import PointOfContactPage from "../client_Interview/PointOfContactPage";
import BackFills from "./BackFills";
import BasicInfo from "./BasicInfo";
import Budget from "./Budget";
import Languages from "./Languages";
import LocationPage from "./LocationPage";
import OtherDetails from "./OtherDetails";
import Requirements from "./Requirements";
import SchedulingPage from "./SchedulingPage";
import { useFormContext } from "react-hook-form";
import {
  dedicatedFields,
  dispatchFields,
  scheduledFields,
} from "./triggerfilelds";

/*
 *  PostAJobFields
 *    - Displays a form to add post a job details
 * @returns {JSX.Element} The rendered PostAJobFields
 * @constructor
 */
const PostAJobFields = ({
  setIsDisable,
  isDisable,
}: {
  setIsDisable: Dispatch<SetStateAction<boolean>>;
  isDisable: boolean;
}) => {
  const { setActiveKey, setISOpenSidebar, setSelectedId } = useDrawerStore();
  const { currentLocation } = usePostAJobStore();
  const { showPopup } = usePopupStore();
  const navigate = useNavigate();
  const { trigger } = useFormContext();

  const handleTrigger = async () => {
    let isValid = false;
    const currentValidatedFields =
      currentLocation === CurrentLocation.dedicated
        ? dedicatedFields
        : currentLocation === CurrentLocation.dispatch
          ? dispatchFields
          : scheduledFields;

    isValid = await trigger(currentValidatedFields);

    if (isValid) {
      console.log("isValid :", isValid);
      setIsDisable(true);
    } else {
      toast.error("Please fill all the required fields");
    }
  };

  const handleDeleteInterviewer = async (_: number) => {
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

  const pointOfContactSection = pointOfContactData.map((item) => ({
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
      setSelectedId(item.id);
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
      setSelectedId(Number(item.id));
    },
    onDelete: () => handleDeleteInterviewer(Number(item.id)),
  }));

  const formattedInterviewerSections = interviewerValue.map((section) => ({
  ...section,
  items: section.items.map((item) => ({
    ...item,
    value: item.value instanceof Date ? item.value.toISOString() : item.value,
  })),
}));

  return (
    <div className="flex gap-4 flex-row p-2">
      <div className="w-2/3 space-y-2">
        <BasicInfo isDisable={isDisable} />
        <LocationPage isDisable={isDisable} />
        <SchedulingPage isDisable={isDisable} />
        <Requirements isDisable={isDisable} />
        {currentLocation === CurrentLocation.dedicated && (
          <>
            <BackFills isDisable={isDisable} />
            <Budget isDisable={isDisable} />
          </>
        )}
        <Languages isDisable={isDisable} />
        <OtherDetails isDisable={isDisable} />
        {!isDisable && (
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
                handleTrigger();
              }}
              className="rounded-full"
            >
              Review Job Posting
            </Button>
          </div>
        )}
      </div>

      <div className="w-1/3">
        {currentLocation === CurrentLocation.dedicated ? (
          <>
            {interviewerData.length ? (
              <ClientInterviewerSection
                disabled={isDisable}
                title="Client Interviewer"
                sections={formattedInterviewerSections}
                addAction={
                  <Button
                    onClick={() => {
                      setActiveKey("clientInterviewer");
                      setISOpenSidebar(true);
                    }}
                    className="rounded-full"
                  >
                    Add Client Interviewer
                  </Button>
                }
              />
            ) : (
              <ClientInterviewerCard />
            )}
          </>
        ) : (
          <>
            {pointOfContactData.length ? (
              <ClientInterviewerSection
                disabled={isDisable}
                sections={pointOfContactSection}
                title="Point of Contact"
                addAction={
                  <Button
                    onClick={() => {
                      setActiveKey("addPointOfContact");
                      setISOpenSidebar(true);
                    }}
                    className="rounded-full"
                  >
                    Add Point of Contact
                  </Button>
                }
              />
            ) : (
              <PointOfContactPage />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PostAJobFields;
