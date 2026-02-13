import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { validateName } from "@/pages/engineer/user_profile/Validate";
import { validateEmailRules } from "@/shared/components/commonUI/emailValidation";
import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import ImageUploaderField from "@/shared/components/commonUI/inputs/ImageUploaderField";
import PhoneInputField from "@/shared/components/commonUI/inputs/PhoneInputField";
import { absoluteUrls } from "@/config/urls";
import { usePopupStore } from "@/shared/store/popupStore";
import type { ProfileFormData } from "./types";
import { useAdminUpdatePersonalInfo } from "@/shared/apiServices/admin/adminOpenApiService";
import {
  useAdminProfile,
  useAdminProfileStore,
} from "@/shared/store/useAdminProfileStore";
import { useProfileFileUpload } from "@/shared/hooks/useProfileFileUpload";
import { useAppDownloadProfileFile } from "@/shared/apiServices/commonOpenApiService";

export default function PersonalDetails() {
  const navigate = useNavigate();
  const { showPopup } = usePopupStore();

  /* ---------- Get admin by id ---------- */
  const adminPersonalInfo = useAdminProfile();

  /* ---------- File Download (Profile Pic) ---------- */
  const { data: downloadData, isLoading: isLoadingProfilePicture } =
    useAppDownloadProfileFile("profilePicture");

  /* ---------- Update admin profile ---------- */
  const updateAdminProfile = useAdminUpdatePersonalInfo({
    onSuccess: async () => {
      toast.success("Profile details updated successfully!");
      await useAdminProfileStore.getState().refetchProfile();
      navigate(absoluteUrls.admin.home.dashboard);
    },
    onError: (err) => {
      const msg =
        err instanceof Error ? err.message : "Failed to update profile details";
      toast.error(msg);
    },
  });

  /* ---------- Compute Form Values ---------- */
  const defaultValues: ProfileFormData = {
    fullName: adminPersonalInfo?.fullName || "",
    email: adminPersonalInfo?.email || "",
    phoneNumber: adminPersonalInfo?.phoneNumber || "+91",
    profilePicture:
      downloadData && "downloadUrl" in downloadData
        ? (downloadData.downloadUrl as string)
        : "",
  };

  /* ---------- Form ---------- */
  const methods = useForm<ProfileFormData>({
    defaultValues,
    values: defaultValues,
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  /* ---------- Submit ---------- */
  const handleSubmit = async (data: ProfileFormData) => {
    await showPopup({
      title: "Profile Update",
      body: "Are you sure you want to update this profile?",
      actionButtons: [
        { label: "Cancel", value: null, variant: "outline" },
        {
          label: "Yes, update",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            try {
              if (data.profilePicture instanceof File) {
                await uploadProfileFile(data.profilePicture, "profilePicture");
              }

              await updateAdminProfile.mutateAsync({
                body: {
                  name: data.fullName,
                  email: data.email,
                  phoneNumber: data.phoneNumber ?? "",
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

  /* ---------- File Upload ---------- */
  const { uploadProfileFile, isUploading } = useProfileFileUpload({
    onError: () => toast.error("Failed to update profile picture."),
  });

  return (
    <FormContainer
      methods={methods}
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 mt-2 px-2 pb-4 w-full"
    >
      <div className="flex">
        <ImageUploaderField
          label="Profile Image"
          name="profilePicture"
          initialImageUrl={downloadData?.downloadUrl || ""}
          isLoading={isUploading || isLoadingProfilePicture}
        />
      </div>

      <div className="flex gap-4">
        <InputField
          name="fullName"
          label="Name"
          required
          rules={{ validate: validateName }}
        />

        <InputField
          name="email"
          label="Email Address"
          required
          rules={validateEmailRules}
        />

        <PhoneInputField name="phoneNumber" label="Mobile Number" required />
      </div>

      <div className="flex justify-end">
        <Button type="submit">Save</Button>
      </div>
    </FormContainer>
  );
}
