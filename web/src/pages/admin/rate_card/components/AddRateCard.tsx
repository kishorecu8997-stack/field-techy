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
import { useAdminCreateRateCard } from "@/shared/apiServices/admin/adminOpenApiService";
import { useQueryClient } from "@tanstack/react-query";
import type { PricingFormValues, CreateRateCardParams } from "../types";

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
  const methods = useForm<PricingFormValues>({
    defaultValues: {
      skills: [],
    },
  });
  const { showPopup } = usePopupStore();
  const queryClient = useQueryClient();

  const { mutateAsync: createRateCard, isPending: isCreatingRateCard } = useAdminCreateRateCard({
    onSuccess: async () => {
      // Refetch the rate cards to ensure the index table has latest data
      await queryClient.refetchQueries({ queryKey: ["admin", "rateCards"] });
      toast.success("Rate card created successfully!");
      navigate(absoluteUrls.admin.home.manage_rate_card);
      methods.reset();
    },
    onError: (error: unknown) => {
      console.error("Failed to create rate card:", error);
      toast.error("Failed to create rate card. Please try again.");
    },
  });

  // Transform form data to new API format
  const transformFormDataToApi = (formData: PricingFormValues): CreateRateCardParams => {
    // Extract countryId from country field (e.g., "country1" -> 1)
    const countryValue = formData.country || "";
    const countryId = parseInt(countryValue.replace(/\D/g, "")) || 1;
    
    // Extract serviceCategoryId from serviceCategory field
    const serviceCategoryValue = formData.serviceCategory || "";
    const serviceCategoryId = parseInt(serviceCategoryValue.replace(/\D/g, "")) || 1;

    // Transform skills/tiers to experienceLevels format
    const experienceLevels: CreateRateCardParams["experienceLevels"] = [];

    // Map level string to order number
    const levelOrderMap: Record<string, number> = {
      L1: 1,
      L2: 2,
      L3: 3,
    };

    // Map rate type to engagementModelId
    // 1: Hourly, 2: Daily, 3: Monthly
    const rateTypeToEngagementId: Record<string, number> = {
      hourly: 1,
      daily: 2,
      monthly: 3,
    };

    formData.skills?.forEach((skill: any) => {
      skill.tiers?.forEach((tier: any) => {
        const levelOrder = levelOrderMap[tier.level] || 1;
        const label = tier.level || "";

        // Convert tier values to numbers, defaulting to 0 if empty
        const hourly = parseFloat(tier.hourly) || 0;
        const daily = parseFloat(tier.daily) || 0;
        const monthly = parseFloat(tier.monthly) || 0;

        // Check if we already have an entry for this level
        const existingIndex = experienceLevels.findIndex(
          (exp: CreateRateCardParams["experienceLevels"][number]) => exp.levelOrder === levelOrder
        );

        // Build rates object with engagementModelId as keys
        const rates: Record<string, number> = {};
        if (hourly > 0) rates[String(rateTypeToEngagementId.hourly)] = hourly;
        if (daily > 0) rates[String(rateTypeToEngagementId.daily)] = daily;
        if (monthly > 0) rates[String(rateTypeToEngagementId.monthly)] = monthly;

        if (existingIndex >= 0) {
          // Update existing entry with new rates
          experienceLevels[existingIndex].rates = {
            ...experienceLevels[existingIndex].rates,
            ...rates,
          };
        } else {
          // Add new experience level
          experienceLevels.push({
            levelOrder,
            label,
            rates,
          });
        }
      });
    });

    // Sort by level order
    experienceLevels.sort((a: CreateRateCardParams["experienceLevels"][number], b: CreateRateCardParams["experienceLevels"][number]) => a.levelOrder - b.levelOrder);

    return {
      countryId,
      serviceCategoryId,
      experienceLevels,
    };
  };

  const handleSaveConfirmation = async (data: PricingFormValues) => {
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
            if (isCreatingRateCard) return;
            const apiData = transformFormDataToApi(data);
            // Transform to the format expected by the API
            await createRateCard({
              body: { experienceLevels: apiData.experienceLevels },
              query: { countryId: apiData.countryId, serviceCategoryId: apiData.serviceCategoryId }
            });
            close(true);
          },
        },
      ],
    });
  };

  const onSubmit = (data: PricingFormValues) => {
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
