import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { useEngineerStore } from "@/shared/store/useEngineerStore";
import { useForm } from "react-hook-form";
import { CiWallet } from "react-icons/ci";
import { FiLink2 } from "react-icons/fi";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { RiTodoLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { validatePortfolioLink, validateRate } from "../../Validate";
import type { WorkPreferenceFormData } from "./types";
import {
  useEngineerGetWorkPreference,
  useEngineerUpdateWorkPreference,
  useLookupData,
} from "@/shared/apiServices/engineer/engineerOpenApiService";
import { useEffect } from "react";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";

/**
 * The WorkPreference component renders a form for users to edit their work-related preferences.
 */
const WorkPreference = () => {
  const { showPopup } = usePopupStore();
  const { setActiveKey } = useDrawerStore();
  const { refetchProfile } = useEngineerStore();

  const {
    data: workPreference,
    isLoading: isPrefLoading,
    refetch: refetchHook,
  } = useEngineerGetWorkPreference();
  const { mutateAsync: updateWorkPreference } =
    useEngineerUpdateWorkPreference();

  const { data: employmentTypes } = useLookupData("employmentTypes");
  const { data: serviceCategories } = useLookupData("serviceCategories");

  const methods = useForm<WorkPreferenceFormData>({
    mode: "onSubmit",
  });

  useEffect(() => {
    if (workPreference) {
      methods.reset({
        portfolioLink: workPreference.portfolioLink || "",
        preferredWorkTypes: workPreference.employmentTypeId?.toString() || "",
        servicesCategories: workPreference.serviceCategoryId?.toString() || "",
        ratePreference: workPreference.hourlyRate?.toString() || "",
      });
    }
  }, [workPreference, methods]);

  const handleSubmit = async (data: WorkPreferenceFormData) => {
    await showPopup({
      title: "Update Work Preferences",
      body: "Are you sure you want to update your work preferences?",
      actionButtons: [
        {
          label: "Cancel",
          value: "no",
          variant: "secondary",
          action: async (close) => close(true),
        },
        {
          label: "Yes, update",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            try {
              await updateWorkPreference({
                body: {
                  portfolioLink: data.portfolioLink,
                  employmentTypeId: Number(data.preferredWorkTypes),
                  serviceCategoryId: Number(data.servicesCategories),
                  hourlyRate: Number(
                    data.ratePreference.replace(/[^0-9.]/g, ""),
                  ),
                },
              });
              toast.success("Work Preferences Updated Successfully");

              // Refresh both the store and the local hook
              await refetchProfile();
              await refetchHook();

              close(true);
              setActiveKey("profile");
            } catch (error) {
              console.error("Failed to update work preferences:", error);
              toast.error(
                "Failed to update work preferences. Please try again.",
              );
              close(true);
            }
          },
        },
      ],
    });
  };

  if (isPrefLoading) return <LoaderComponent />;

  return (
    <FormContainer
      methods={methods}
      onSubmit={handleSubmit}
      className="flex flex-col h-full"
    >
      <div className="flex-1 overflow-y-auto px-3 space-y-3">
        <InputField
          label="Portfolio Link"
          name="portfolioLink"
          type="text"
          placeholder="Portfolio Link"
          leftIcon={<FiLink2 className="text-lg text-gray-500" />}
          required
          rules={{ validate: (v: string) => validatePortfolioLink(v) }}
        />
        <SelectField
          label="Preferred Work Types"
          name="preferredWorkTypes"
          placeholder="Preferred Work Type"
          leftIcon={<RiTodoLine className="text-lg text-gray-500" />}
          options={
            employmentTypes?.map((e) => ({
              value: e.id.toString(),
              label: e.name,
            })) || []
          }
          required
        />
        <SelectField
          label="Services Categories"
          name="servicesCategories"
          placeholder="Services Categories"
          leftIcon={<HiOutlineBriefcase className="text-lg text-gray-500" />}
          options={
            serviceCategories?.map((e) => ({
              value: e.id.toString(),
              label: e.name,
            })) || []
          }
          required
        />

        <InputField
          label="Rate Preference"
          name="ratePreference"
          placeholder="Hourly/Fixed Rate Preference"
          leftIcon={<CiWallet className="text-lg text-gray-500" />}
          required
          allowedCharacters="currency"
          rules={{ validate: (v: string) => validateRate(v) }}
        />
      </div>

      <div className="bg-white ">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
        >
          Save Preferences
        </Button>
      </div>
    </FormContainer>
  );
};

export default WorkPreference;
