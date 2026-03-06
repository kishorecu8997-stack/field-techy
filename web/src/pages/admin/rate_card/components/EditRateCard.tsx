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
import { useAdminUpdateRateCard } from "@/shared/apiServices/admin/adminOpenApiService";
import { useGetRateCards } from "@/shared/apiServices/admin/adminService";

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
  const { id } = useParams<{ id: string }>();
  
  // Parse serviceCategoryId from URL param
  const serviceCategoryId = id ? parseInt(id, 10) : 0;
  
  // Store countryId from API response for use in mutation
  const countryIdRef = useRef<number>(1);
  
  console.log("Service Category ID:", serviceCategoryId, "from param:", id);

  const methods = useForm({
    defaultValues: {
      rateType: "masterRateCard",
      clientName: "client1",
      projectName: "project1",
      country: "country1",
      serviceCategory: "",
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

  // Fetch rate cards using the same API as index table
  const { data: rateCardsResponse } = useGetRateCards(
    { page: 1, limit: 100 },
    { enabled: !!serviceCategoryId && serviceCategoryId > 0 }
  );

  // Filter rate cards by serviceCategoryId and populate form
  useEffect(() => {
    if (rateCardsResponse?.data) {
      // Filter by serviceCategoryId
      const filteredData = rateCardsResponse.data.filter(
        (item) => item.serviceCategoryId === serviceCategoryId
      );
      
      console.log("Filtered rate cards:", filteredData);
      
      if (filteredData.length > 0) {
        // Get the first item to get country info
        const firstItem = filteredData[0];
        
        // Store countryId for use in mutation
        countryIdRef.current = firstItem.countryId || 1;
        
        // Map country name to country value (e.g., "India" -> "country1")
        const countryValueMap: Record<string, string> = {
          "India": "country1",
          "United Kingdom": "country2",
        };
        const countryValue = countryValueMap[firstItem.country] || firstItem.country;
        
        // Transform API data to form format
        const tiers = filteredData.map((item) => {
          const level = item.experienceLevels?.[0] || "L1";
          return {
            level: level,
            description: level === "L1" ? "Junior (1–3 yrs)" : level === "L2" ? "Mid (3–3 yrs)" : "Senior (5+ yrs)",
            hourly: parseFloat(item.hourly) || 0,
            halfDay: item.halfDay === "-" ? 0 : parseFloat(item.halfDay) || 0,
            fullDay: item.fullDay === "-" ? 0 : parseFloat(item.fullDay) || 0,
            weekly: item.weekly === "-" ? 0 : parseFloat(item.weekly) || 0,
            monthly: item.monthly === "-" ? 0 : parseFloat(item.monthly) || 0,
          };
        });

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
  }, [rateCardsResponse, serviceCategoryId, methods]);

  const updateRateCardMutation = useAdminUpdateRateCard({
    onSuccess: () => {
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
      toast.error("Invalid service category ID. Please try again from the list.");
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
            // Transform form data to API format
            // The API expects: { countryId, experienceLevels: [{ levelOrder, label, rates: { hourly, halfDay4h, fullDay8h, weekly5d, monthly } }] }
            const firstSkill = data.skills?.[0];
            const tiers = firstSkill?.tiers || [];
            
            const experienceLevels = tiers.map((tier: any) => {
              // Convert level string (L1, L2, L3) to levelOrder number
              const levelOrder = tier.level === "L1" ? 1 : tier.level === "L2" ? 2 : tier.level === "L3" ? 3 : 0;
              
              return {
                levelOrder,
                label: tier.description || "",
                rates: {
                  hourly: parseFloat(tier.hourly) || 0,
                  halfDay4h: parseFloat(tier.halfDay) || 0,
                  fullDay8h: parseFloat(tier.fullDay) || 0,
                  weekly5d: parseFloat(tier.weekly) || 0,
                  monthly: parseFloat(tier.monthly) || 0,
                },
              };
            });
            
            // Get countryId from API response
            const finalCountryId = countryIdRef.current;
            
            updateRateCardMutation.mutate({
              query: { serviceCategoryId },
              body: {
                countryId: finalCountryId,
                experienceLevels,
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
