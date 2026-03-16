/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import RateCardForm from "./RateCardForm";
import PricingModel from "./PricingModel";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import RateCardDetails from "./RateCardDetails";
import { Button } from "@/shared/components/commonUI/Buttons";
import { toast } from "react-toastify";
import { absoluteUrls } from "@/config/urls";
import { usePopupStore } from "@/shared/store/popupStore";
import {
  useAdminCreateRateCard,
  useGetRateCards,
} from "@/shared/apiServices/admin/adminOpenApiService";
import { useQueryClient } from "@tanstack/react-query";

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
  const {
    serviceCategoryId: serviceCategoryIdParam,
    countryId: countryIdParam,
  } = useParams<{
    serviceCategoryId: string;
    countryId: string;
  }>();
  const queryClient = useQueryClient();

  // Parse serviceCategoryId and countryId from URL params
  const parsedServiceCategoryId = serviceCategoryIdParam
    ? parseInt(serviceCategoryIdParam, 10)
    : 0;
  const serviceCategoryId = Number.isNaN(parsedServiceCategoryId)
    ? 0
    : parsedServiceCategoryId;
  const parsedCountryId = countryIdParam ? parseInt(countryIdParam, 10) : 0;
  const countryId = Number.isNaN(parsedCountryId) ? 0 : parsedCountryId;

  // Store countryId from URL param for use in mutation
  const countryIdRef = useRef<number>(countryId);

  const methods = useForm<any>({
    defaultValues: {
      rateType: "masterRateCard",
      clientName: "",
      projectName: "",
      country: "",
      serviceCategory: "",
    },
  });

  // Fetch rate cards using the same API as index table
  const { data: rateCardsResponse } = useGetRateCards(
    { page: 1, limit: 100 },
    {
      enabled:
        !!serviceCategoryId &&
        serviceCategoryId > 0 &&
        !!countryId &&
        countryId > 0,
    },
  );

  // Filter rate cards by serviceCategoryId AND countryId and populate form
  useEffect(() => {
    console.log("useEffect triggered:", {
      serviceCategoryId,
      countryId,
      hasData: !!rateCardsResponse?.data,
    });

    if (rateCardsResponse?.data) {
      // Filter by serviceCategoryId AND countryId
      const filteredData = rateCardsResponse.data.filter(
        (item) =>
          item.serviceCategoryId === serviceCategoryId &&
          item.countryId === countryId,
      );

      console.log("Filtered rate cards:", filteredData);

      if (filteredData.length > 0) {
        // Get the first item to get country info
        const firstItem = filteredData[0];

        // Use countryId from URL parameter
        countryIdRef.current = countryId;

        // Map country name to country value (e.g., "India" -> "country1")
        const countryValueMap: Record<string, string> = {
          India: "country1",
          "United Kingdom": "country2",
        };
        const countryValue =
          countryValueMap[firstItem.country] || firstItem.country;

        // Transform API data to form format
        // Group by experience level
        const levelRatesMap: Record<
          number,
          { hourly: number; daily: number; monthly: number }
        > = {};

        filteredData.forEach((item) => {
          const levelId = item.experienceLevelId || 1;

          // Parse the rates array
          if (item.rates && Array.isArray(item.rates)) {
            item.rates.forEach((rate) => {
              if (!levelRatesMap[levelId]) {
                levelRatesMap[levelId] = { hourly: 0, daily: 0, monthly: 0 };
              }

              // Map engagementModelId to rate type
              // 1: Hourly, 2: Daily, 3: Monthly
              if (rate.engagementModelId === 1) {
                levelRatesMap[levelId].hourly = parseFloat(rate.rate) || 0;
              } else if (rate.engagementModelId === 2) {
                levelRatesMap[levelId].daily = parseFloat(rate.rate) || 0;
              } else if (rate.engagementModelId === 3) {
                levelRatesMap[levelId].monthly = parseFloat(rate.rate) || 0;
              }
            });
          }
        });

        // Build tiers array from the mapped data
        const tiers = [
          {
            level: "L1",
            description: "Junior (1–3 yrs)",
            hourly: levelRatesMap[1]?.hourly || 0,
            daily: levelRatesMap[1]?.daily || 0,
            monthly: levelRatesMap[1]?.monthly || 0,
          },
          {
            level: "L2",
            description: "Mid (3–5 yrs)",
            hourly: levelRatesMap[2]?.hourly || 0,
            daily: levelRatesMap[2]?.daily || 0,
            monthly: levelRatesMap[2]?.monthly || 0,
          },
          {
            level: "L3",
            description: "Senior (5+ yrs)",
            hourly: levelRatesMap[3]?.hourly || 0,
            daily: levelRatesMap[3]?.daily || 0,
            monthly: levelRatesMap[3]?.monthly || 0,
          },
        ];

        methods.reset({
          rateType: "masterRateCard",
          clientName: "client1",
          projectName: "project1",
          country: countryValue,
          serviceCategory: `serviceCategory${serviceCategoryId}`,
          skills: [
            {
              id: "d22b25f8-c18c-4db9-badb-cdbb64b556e7",
              name: firstItem.serviceCategory || "Skill 1",
              isEditing: false,
              tiers: tiers,
            },
          ],
        });
      }
    }
  }, [rateCardsResponse, serviceCategoryId, countryId, methods]);

  const createRateCardMutation = useAdminCreateRateCard({
    onSuccess: async () => {
      // Refetch the rate cards to ensure the index table has latest data
      await queryClient.refetchQueries({ queryKey: ["admin", "rateCards"] });
      toast.success("Rate card updated successfully!");
      navigate(absoluteUrls.admin.home.manage_rate_card);
      methods.reset();
    },
    onError: (error: unknown) => {
      console.error("Failed to update rate card:", error);
      toast.error("Failed to update rate card. Please try again.");
    },
  });

  const handleSaveConfirmation = async (data: any) => {
    console.log("handleSaveConfirmation called with data:", data);

    // Validate service category ID
    if (!serviceCategoryId || serviceCategoryId === 0) {
      toast.error(
        "Invalid service category ID. Please try again from the list.",
      );
      return;
    }

    await showPopup({
      title: "Update Rate Card",
      body: "Are you sure you want to update this rate card?",
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
            // Transform form data to new API format
            // The API expects: { experienceLevels: [{ levelOrder, label, rates: { "1": hourly, "2": daily, "3": monthly } }] }
            const firstSkill = data.skills?.[0];
            const tiers = firstSkill?.tiers || [];

            // Map rate type to engagementModelId
            // 1: Hourly, 2: Daily, 3: Monthly
            const experienceLevels = tiers.map((tier: any) => {
              // Convert level string (L1, L2, L3) to levelOrder number
              const levelOrder =
                tier.level === "L1"
                  ? 1
                  : tier.level === "L2"
                    ? 2
                    : tier.level === "L3"
                      ? 3
                      : 0;

              // Build rates object with engagementModelId as keys
              const rates: Record<string, number> = {};
              const hourly = parseFloat(tier.hourly) || 0;
              const daily = parseFloat(tier.daily) || 0;
              const monthly = parseFloat(tier.monthly) || 0;

              if (hourly > 0) rates["1"] = hourly;
              if (daily > 0) rates["2"] = daily;
              if (monthly > 0) rates["3"] = monthly;

              return {
                levelOrder,
                label: tier.description || "",
                rates,
              };
            });

            // Get countryId from API response
            const finalCountryId = countryIdRef.current;

            // Use POST API for update as well
            createRateCardMutation.mutate({
              body: { experienceLevels },
              query: {
                countryId: finalCountryId,
                serviceCategoryId: serviceCategoryId,
              },
            });
            close(true);
          },
        },
      ],
    });
  };

  const onSubmit = (data: any) => {
    console.log("Form submitted with data:", data);
    handleSaveConfirmation(data);
  };

  const isEdit = path.includes("/edit");
  const isView = path.includes("/view");

  return (
    <div className="dark:bg-gray-800 w-full h-full flex flex-col overflow-y-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-gray-900 dark:text-white">
          {isEdit
            ? "Edit Rate Card"
            : isView
              ? "View Rate Card"
              : "Add Rate Card"}
        </h2>
        <Button type="button" variant="solid" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
      <FormContainer
        methods={methods}
        onSubmit={onSubmit}
        className="w-full h-full flex-1 overflow-y-auto bg-white dark:bg-gray-700 p-4 rounded-lg"
      >
        {isEdit || isView ? (
          <RateCardForm readOnly={isView || isEdit} />
        ) : (
          <RateCardDetails />
        )}
        <PricingModel />

        {isEdit && (
          <div className="flex justify-end">
            <Button
              type="submit"
              className="w-fit bg-gradient-to-r bg-teal-900 text-white py-1 rounded-lg hover:opacity-90 transition"
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
