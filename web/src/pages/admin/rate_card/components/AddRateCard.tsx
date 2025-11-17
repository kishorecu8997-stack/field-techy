import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import PricingModel from "./PricingModel";
import RateCardForm from "./RateCardForm";

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
  const methods = useForm({
    defaultValues: {
      rateType: "",
      clientName: "",
      projectName: "",
      country: "",
      skills: [],
    },
  });
  const onSubmit = (data: any) => {
    console.log(data);
  };
  return (
    <div className="bg-white dark:bg-neutral-700 w-full h-full flex flex-col overflow-y-auto p-4">
      <FormContainer
        methods={methods}
        onSubmit={onSubmit}
        className="w-full h-full flex-1 overflow-y-auto"
      >
        <RateCardForm />
        <PricingModel />
        <div className="flex justify-end">
          <Button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-md cursor-pointer">
            Submit
          </Button>
        </div>
      </FormContainer>
    </div>
  );
};

export default AddRateCard;
