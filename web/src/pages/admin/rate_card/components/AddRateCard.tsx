/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import PricingModel from "./PricingModel";
import RateCardForm from "./RateCardForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { usePopupStore } from "@/shared/store/popupStore";
import { absoluteUrls } from "@/config/urls";

/**
 * AddRateCard Component
 *
 * Renders a form for creating or editing a rate card.
 * Includes sections for rate details and pricing model.
 *
 * @component
 * @returns {JSX.Element} The rendered AddRateCard component.
 *
 * @example
 * // Example usage:
 * <AddRateCard />
 */
const AddRateCard = () => {
  const navigate = useNavigate();
  const methods = useForm({
    defaultValues: {
      rateType: "",
      clientName: "",
      projectName: "",
      country: "",
      skills: [],
    },
  });
  const { showPopup } = usePopupStore();

  const handleSaveConfirmation = async (data: any) => {
    console.log("data :", data);
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          action: async (close: any) => {
            console.log("Deleting job:", close);
            // TODO: call your delete API here
            // await deleteJob(job.id);
            toast.success("Rate card added successfully!");
            navigate(absoluteUrls.admin.home.manage_rate_card);
            methods.reset();
            close(true);
          },
        },
      ],
    });
  };

  const onSubmit = (data: any) => {
    console.log(data);
    handleSaveConfirmation(data);
  };
  return (
    <div className="bg-white dark:bg-neutral-700 w-full h-full flex flex-col overflow-y-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Add Rate Card</h2>
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
        <RateCardForm />
        <PricingModel />
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-emerald-600 text-white px-4 py-2 rounded-md cursor-pointer"
          >
            Submit
          </Button>
        </div>
      </FormContainer>
    </div>
  );
};

export default AddRateCard;
