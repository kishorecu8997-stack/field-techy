import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import {
  InputField,
  TextareaInput,
  SelectField,
} from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { usePopupStore } from "@/shared/store/popupStore";
import {
  validateNotificationMessage,
  validateNotificationTitle,
} from "@/utils/validate";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMemo, useEffect } from "react";

import {
  useAdminBroadcastNotification,
  LookupTable,
  useAppGetLookupData,
} from "@/shared/apiServices/admin/adminOpenApiService";
import { useAdminCountryStore } from "@/shared/store/useAdminCountryStore";

interface AddNotificationProps {
  title: string;
  message: string;
  client: boolean;
  engineer: boolean;
  subadmin: boolean;
  countryId: string;
  stateId: string;
  cityId: string;
}

/**
 * AddNotification Component
 *
 * Form to create a new system notification with fields for title, type, audience,
 * user group, and message (with length/validation). Uses react-hook-form and
 * dummy data for dropdown options. Shows success toast on submit.
 *
 * @component
 * @returns {JSX.Element} Notification creation form with validation.
 */
export default function AddNotification() {
  const navigate = useNavigate();
  const { showPopup } = usePopupStore();
  const { regionId } = useAdminCountryStore();

  const methods = useForm<AddNotificationProps>({
    defaultValues: {
      title: "",
      message: "",
      client: false,
      engineer: false,
      subadmin: false,
      countryId: "",
      stateId: "",
      cityId: "",
    },
  });

  const { watch, setValue } = methods;
  const countryId = watch("countryId");
  const stateId = watch("stateId");

  const { data: countriesLookup } = useAppGetLookupData(
    LookupTable.Countries,
    Number(regionId),
    {
      enabled: !!regionId,
    },
  );

  const { data: statesLookup } = useAppGetLookupData(
    LookupTable.States,
    Number(countryId),
    {
      enabled: !!countryId,
    },
  );

  const { data: citiesLookup } = useAppGetLookupData(
    LookupTable.Cities,
    Number(stateId),
    {
      enabled: !!stateId,
    },
  );
  useEffect(() => {
    setValue("countryId", "");
    setValue("stateId", "");
    setValue("cityId", "");
  }, [regionId]);

  useEffect(() => {
    setValue("stateId", "");
    setValue("cityId", "");
  }, [countryId]);

  useEffect(() => {
    setValue("cityId", "");
  }, [stateId]);

  const countryOptions = useMemo(
    () =>
      countriesLookup?.map((c) => ({
        value: String(c.id),
        label: c.name ?? "Unknown",
      })) ?? [],
    [countriesLookup],
  );

  const stateOptions = useMemo(
    () =>
      statesLookup?.map((s) => ({
        value: String(s.id),
        label: s.name ?? "Unknown",
      })) ?? [],
    [statesLookup],
  );

  const cityOptions = useMemo(
    () =>
      citiesLookup?.map((c) => ({
        value: String(c.id),
        label: c.name ?? "Unknown",
      })) ?? [],
    [citiesLookup],
  );

  const broadcastNotification = useAdminBroadcastNotification({
    onSuccess: (data) => {
      toast.success(data.message);
      navigate(absoluteUrls.admin.home.manage_notification);
    },
    onError: () => {
      toast.error("Failed to broadcast notification");
    },
  });

  const handleSubmit = async (data: AddNotificationProps) => {
    await showPopup({
      title: "Broadcast Notification",
      body: "Are you sure you want to send this notification?",
      actionButtons: [
        { label: "Cancel", value: null, variant: "outline" },
        {
          label: "Send",
          value: "send",
          variant: "primary",
          action: async (close) => {
            try {
              await broadcastNotification.mutateAsync({
                body: {
                  title: data.title,
                  message: data.message,
                  sendTo: {
                    client: data.client,
                    engineer: data.engineer,
                    subadmin: data.subadmin,
                  },
                  countryId: Number(data.countryId),
                  stateId: Number(data.stateId),
                  cityId: Number(data.cityId),
                },
              });

              close(true);
            } catch {
              close(false);
            }
          },
        },
      ],
    });
  };

  return (
    <div className="w-full h-full flex flex-col px-4 py-2 gap-3">
      <div className="flex justify-between items-center">
        <p className="mt-2 mb-6 font-semibold">Broadcast Notification</p>
        <Button
          type="submit"
          variant="solid"
          onClick={() => navigate(absoluteUrls.admin.home.manage_notification)}
        >
          Back
        </Button>
      </div>
      <div className="bg-white dark:bg-gray-700 rounded-lg p-2">
        <FormContainer
          methods={methods}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 mt-2 px-2 pb-4 w-full"
        >
          <InputField
            name="title"
            label="Notification Title"
            placeholder="Enter Notification Title"
            required
            rules={{
              validate: (v) => validateNotificationTitle(v),
            }}
          />

          <TextareaInput
            name="message"
            label="Notification Message"
            placeholder="Enter Notification Message"
            required
            rules={{
              validate: (v: string) => validateNotificationMessage(v),
            }}
          />

          <div>
            <p className="font-medium mb-2">Send To</p>

            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input type="checkbox" {...methods.register("client")} />
                Client
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" {...methods.register("engineer")} />
                Engineer
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" {...methods.register("subadmin")} />
                Sub Admin
              </label>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <SelectField
              name="countryId"
              label="Country"
              placeholder="Select Country"
              options={countryOptions}
              required
              disabled={!regionId}
            />

            <SelectField
              name="stateId"
              label="State"
              placeholder="Select State"
              options={stateOptions}
              disabled={!countryId}
            />

            <SelectField
              name="cityId"
              label="City"
              placeholder="Select City"
              options={cityOptions}
              disabled={!stateId}
            />
          </div>

          <div className="flex justify-end mt-2">
            <Button
              type="submit"
              className="bg-teal-900 text-white py-2 px-6 rounded-lg"
            >
              Send Notification
            </Button>
          </div>
        </FormContainer>
      </div>
    </div>
  );
}
