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
import { useAdminFileStream } from "@/shared/apiServices/admin/adminService";

import { useAdminProfileStore } from "@/shared/store/useAdminProfileStore";
import type { ProfileFormData } from "./types";
import {
  useAdminUpdatePersonalInfo,
  useGetAdminPersonalInfo,
} from "@/shared/apiServices/admin/adminOpenApiService";
import { queryClient } from "@/main";

export default function PersonalDetails() {
  const navigate = useNavigate();
  const { showPopup } = usePopupStore();
  const session = useUserSessionStore((s) => s.session);
  const { adminProfile } = useAdminProfileStore();

  /* ---------- Stream image ---------- */
  const { data: adminProfileStream } = useAdminFileStream(
    adminProfile?.profilePicture,
  );

  const [, setAdminProfilePic] = useState<string>("");

  useEffect(() => {
    if (!adminProfileStream?.blob) return;

    const url = URL.createObjectURL(adminProfileStream.blob);
    setAdminProfilePic(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [adminProfileStream]);

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
  }, [adminPersonalInfo]);

  /* ---------- Upadet admin profile ---------- */
  const updateAdminProfile = useAdminUpdatePersonalInfo({
    onSuccess: async () => {
      toast.success("Profile details updated successfully!");
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

  return (
    <FormContainer
      methods={methods}
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 mt-2 px-2 pb-4 w-full"
    >
      <div className="flex">
        <ImageUploaderField label="Profile Image" name="profilePicture" />
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
