/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import RateCardForm from "./RateCardForm";
import PricingModel from "./PricingModel";
import { useLocation, useNavigate } from "react-router-dom";
import RateCardDetails from "./RateCardDetails";
import { Button } from "@/shared/components/commonUI/Buttons";
import { toast } from "react-toastify";
import { absoluteUrls } from "@/config/urls";
import { usePopupStore } from "@/shared/store/popupStore";

/**
 * EditRateCard Component
 *
 * Displays and manages a rate card form in edit or view mode.
 * Uses React Hook Form for managing form state and validation.
 *
 * - In edit mode (`/edit` route), shows editable form fields via `RateCardForm`.
 * - In view mode, shows static rate card details via `RateCardDetails`.
 *
 * @component
 * @returns {JSX.Element} The rendered EditRateCard component.
 *
 * @example
 * // Example usage:
 * <EditRateCard />
 */

const EditRateCard = () => {
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const { showPopup } = usePopupStore();

  const methods = useForm({
    defaultValues: {
      rateType: "masterRateCard",
      clientName: "client1",
      projectName: "project1",
      country: "country1",
      skills: [
        {
          id: "d22b25f8-c18c-4db9-badb-cdbb64b556e7",
          name: "Skill 1",
          isEditing: false,
          tiers: [
            {
              level: "L1",
              description: "Junior (1–3 yrs)",
              hourly: 25,
              halfDay: 80,
              fullDay: 160,
              weekly: 750,
              monthly: 3000,
            },
            {
              level: "L2",
              description: "Mid (3–5 yrs)",
              hourly: 40,
              halfDay: 120,
              fullDay: 240,
              weekly: 1100,
              monthly: 4400,
            },
            {
              level: "L3",
              description: "Senior (5+ yrs)",
              hourly: 55,
              halfDay: 160,
              fullDay: 320,
              weekly: 1500,
              monthly: 6000,
            },
          ],
        },
      ],
    },
  });

  const handleSaveConfirmation = async (data: any) => {
    await showPopup({
      title: "Add Rate Card",
      body: "Are you sure you want to save this details?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Save",
          value: "save",
          variant: "primary",
          action: async (close) => {
            console.log("Deleting job:", data);
            // TODO: call your delete API here
            // await deleteJob(job.id);
            toast.success("Rate card updated successfully!");
            navigate(absoluteUrls.admin.home.manage_rate_card);
            methods.reset();
            close(true);
          },
        },
      ],
    });
  };

  const onSubmit = (data: any) => {
    handleSaveConfirmation(data);
  };

  const isEdit = path.includes("/edit");
  const isView = path.includes("/view");

  return (
    <div className="bg-white dark:bg-neutral-700 w-full h-full flex flex-col overflow-y-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-gray-900">
          {isEdit
            ? "Edit Rate Card"
            : isView
            ? "View Rate Card"
            : "Add Rate Card"}
        </h2>
        <Button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-neutral-900 text-neutral-200 hover:bg-neutral-800 dark:bg-neutral-600 dark:text-neutral-950"
        >
          Back
        </Button>
      </div>
      <FormContainer
        methods={methods}
        onSubmit={onSubmit}
        className="w-full h-full flex-1 overflow-y-auto"
      >
        {isEdit ? <RateCardForm /> : <RateCardDetails />}
        <PricingModel />

        {isEdit && (
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
            >
              Submit
            </Button>
          </div>
        )}
      </FormContainer>
    </div>
  );
};

export default EditRateCard;
