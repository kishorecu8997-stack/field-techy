import { useEffect, useState } from "react";
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
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import type { ProfileFormData } from "./types";
import {
  useAdminUpdatePersonalInfo,
  useGetAdminPersonalInfo,
} from "@/shared/apiServices/admin/adminOpenApiService";
import { queryClient } from "@/main";
import { useProfileFileUpload } from "@/shared/hooks/useProfileFileUpload";
import { getUserId } from "@/utils";
import { useAppDownloadProfileFile } from "@/shared/apiServices/commonOpenApiService";

export default function PersonalDetails() {
  const navigate = useNavigate();
  const { showPopup } = usePopupStore();
  const session = useUserSessionStore((s) => s.session);
  const userId = getUserId();

  /* ---------- Get admin by id ---------- */
  const { data: adminPersonalInfo } = useGetAdminPersonalInfo(
    session?.accessToken || "",
  );

  useEffect(() => {
    const getAdmin = async () => {
      await queryClient.invalidateQueries({
        queryKey: ["adminPersonalInfo"],
      });
    };
    getAdmin();
  }, []);

  /* ---------- Update admin profile ---------- */
  const updateAdminProfile = useAdminUpdatePersonalInfo({
    onSuccess: async () => {
      toast.success("Profile details updated successfully!");
      // Invalidate both personal info and the generic admin query key if needed
      await queryClient.invalidateQueries({
        queryKey: ["adminPersonalInfo"],
      });
      navigate(absoluteUrls.admin.home.dashboard);
    },
    onError: (err) => {
      const msg =
        err instanceof Error ? err.message : "Failed to update profile details";
      toast.error(msg);
    },
  });

  /* ---------- Form ---------- */
  const methods = useForm<ProfileFormData>({
    defaultValues: {
      fullName: adminPersonalInfo?.name || "",
      email: adminPersonalInfo?.email || "",
      phoneNumber: adminPersonalInfo?.phoneNumber || "+91",
      profilePicture: "",
    },
  });
  const profileImage = methods.watch("profilePicture");

  /* ---------- Reset Form on Data Load ---------- */
  useEffect(() => {
    if (adminPersonalInfo) {
      methods.reset({
        fullName: adminPersonalInfo.name,
        email: adminPersonalInfo.email,
        phoneNumber: adminPersonalInfo.phoneNumber,
        profilePicture: methods.getValues("profilePicture"),
      });
    }
  }, [adminPersonalInfo, methods]);

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
              await updateAdminProfile.mutateAsync({
                body: {
                  name: data.fullName,
                  email: data.email,
                  phoneNumber: data.phoneNumber ?? "",
                },
                token: session?.accessToken ?? "",
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
    onSuccess: () => {
      toast.success("Profile picture updated successfully!");
    },
    onError: () => toast.error("Failed to update profile picture."),
  });

  useEffect(() => {
    if (userId && profileImage instanceof File) {
      uploadProfileFile(profileImage, "profilePicture");
    }
  }, [userId, profileImage]);

  /* ---------- File Download (Profile Pic) ---------- */
  const { data: downloadData, isLoading: isLoadingProfilePicture } = useAppDownloadProfileFile("profilePicture");
  
  // Create object URL when blob is received
  const [, setProfilePicUrl] = useState<string>("");
  
  useEffect(() => {
    if (downloadData && 'downloadUrl' in (downloadData)) {
       const url = (downloadData).downloadUrl;
       setProfilePicUrl(url);
       methods.setValue("profilePicture", url);
    } 
  }, [downloadData, methods]);

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
