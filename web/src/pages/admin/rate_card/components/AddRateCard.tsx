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
import { useCreateRateCard } from "@/shared/apiServices/admin/adminService";
import type { CreateRateCardParams, CreateRateCardResponse } from "@/shared/apiServices/admin/adminTypes";

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

  const createRateCardMutation = useCreateRateCard({
    onSuccess: (data: CreateRateCardResponse) => {
      toast.success("Rate card created successfully!");
      navigate(absoluteUrls.admin.home.manage_rate_card);
      methods.reset();
    },
    onError: (error: unknown) => {
      console.error("Failed to create rate card:", error);
      toast.error("Failed to create rate card. Please try again.");
    },
  });

  // Helper to map dropdown value to ID
  const mapDropdownValueToId = (value: string): number => {
    if (!value) return 0;
    const num = parseInt(value.replace(/\D/g, ""));
    return num || 0;
  };

  // Helper to get engagement model ID from rate type
  // Based on the form structure, we need to determine which engagement model to use
  // Looking at the skills tiers, each has: hourly, halfDay, fullDay, weekly, monthly
  // For simplicity, we'll use Monthly (3) as default or map based on what's filled
  const getEngagementModelId = (): number => {
    // Default to Monthly (3) - can be customized based on form selection
    return 3;
  };

  // Transform form data to API format
  const transformFormDataToApi = (formData: any): CreateRateCardParams => {
    const countryId = mapDropdownValueToId(formData.country);
    const engagementModelId = getEngagementModelId();

    // Transform skills to API format
    // Each skill has tiers with: level (L1/L2/L3), hourly, halfDay, fullDay, weekly, monthly
    const skills: CreateRateCardParams["skills"] = [];

    formData.skills?.forEach((skill: any) => {
      skill.tiers?.forEach((tier: any) => {
        // Map level to experienceLevelId
        const levelMap: Record<string, number> = {
          L1: 1, // Junior
          L2: 2, // Mid
          L3: 3, // Senior
        };
        const experienceLevelId = levelMap[tier.level] || 1;

        // For serviceCategoryId, we'll use a default or derive from skill name
        // Since the form doesn't have a direct service category selection in this component,
        // we'll use a default value (1) - this should be updated based on actual requirements
        const serviceCategoryId = 1;

        // Use the monthly rate as the primary rate (or we could use hourly/daily based on selection)
        const rate = parseFloat(tier.monthly) || parseFloat(tier.hourly) || 
                     parseFloat(tier.halfDay) || parseFloat(tier.fullDay) || 
                     parseFloat(tier.weekly) || 0;

        if (rate > 0) {
          skills.push({
            serviceCategoryId,
            experienceLevelId,
            rate,
          });
        }
      });
    });

    return {
      countryId,
      engagementModelId,
      skills,
    };
  };

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
            const apiData = transformFormDataToApi(data);
            createRateCardMutation.mutate(apiData);
            close(true);
          },
        },
      ],
    });
  };

  const onSubmit = (data: any) => {
    handleSaveConfirmation(data);
  };
  return (
    <div className="w-full h-full flex flex-col overflow-y-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-gray-900 dark:text-white">
          Add Rate Card
        </h2>
        <Button type="button" onClick={() => navigate(-1)} variant="solid">
          Back
        </Button>
      </div>
      <div className="bg-white dark:bg-gray-700 rounded-md p-4">
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
    </div>
  );
};

export default AddRateCard;
