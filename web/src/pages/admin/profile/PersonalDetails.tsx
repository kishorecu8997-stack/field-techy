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
import {
  useAdminGetById,
  useAdminUpdateProfileMutation,
  useAdminUploadFileMutation,
} from "@/shared/apiServices/admin/adminService";

import { useStreamedImage } from "./useStreamedImage";
import { AdminAdapter } from "@/shared/apiServices/admin/adminAdapter";
import type { ProfileFormData } from "./types";

/* ---------- Helper ---------- */
const getFileFromProfilePicture = async (
  profilePicture: File | string
): Promise<File | null> => {
  if (profilePicture instanceof File) return profilePicture;

  if (typeof profilePicture === "string") {
    const response = await fetch(profilePicture);
    const blob = await response.blob();
    return new File([blob], "avatar.jpeg", { type: blob.type });
  }

  return null;
};

export default function PersonalDetails() {
  const navigate = useNavigate();
  const { showPopup } = usePopupStore();

  const session = useUserSessionStore((s) => s.session);
  const adminUpdateProfileMutation = useAdminUpdateProfileMutation();

  /* ---------- SINGLE source of truth ---------- */
  const [profilePictureId, setProfilePictureId] = useState<string | null>(
    session?.profilePicture ?? null
  );

  /* ---------- Stream image ---------- */
  const { url: adminProfilePic } = useStreamedImage(
    profilePictureId,
    AdminAdapter.downloadFileStream
  );

  /* ---------- Get admin by id ---------- */
  const { mutate: getAdminById } = useAdminGetById({
    onSuccess: (resp: any) => {
      methods.reset({
        fullName: resp.fullName,
        email: resp.email,
        phoneNumber: resp.phoneNumber,
        profilePicture: null,
      });

      setProfilePictureId(resp.profilePicture ?? null);
    },
    onError: () => {
      toast.error("Failed to load profile details");
    },
  });

  useEffect(() => {
    if (session?.userId) {
      getAdminById(session.userId);
    }
  }, [session?.userId]);

  /* ---------- Form ---------- */
  const methods = useForm<ProfileFormData>({
    defaultValues: {
      fullName: session?.name,
      email: session?.email,
      phoneNumber: "",
      profilePicture: null,
    },
  });

  /* ---------- ONLY effect needed ---------- */
  useEffect(() => {
    if (adminProfilePic) {
      console.log("adminProfilePic :", adminProfilePic);
      methods.setValue("profilePicture", adminProfilePic, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [adminProfilePic, methods]);

  /* ---------- Upload ---------- */
  const { mutateAsync: uploadProfileImage } = useAdminUploadFileMutation();

  /* ---------- Submit ---------- */
  const handleSubmit = async (data: ProfileFormData) => {
    let finalProfilePicKey = profilePictureId;

    if (data.profilePicture) {
      const file = await getFileFromProfilePicture(data.profilePicture);
      if (!file) return;

      const res: any = await uploadProfileImage({
        adminId: session?.userId || "",
        file,
        fileType: "ADM_PROFILE_PIC",
      });

      finalProfilePicKey = res.fileKey;
      setProfilePictureId(res.fileKey);
    }

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
            await adminUpdateProfileMutation.mutateAsync(
              {
                id: session?.userId || "",
                fullName: data.fullName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                profilePicture: finalProfilePicKey,
              },
              {
                onSuccess: (resp: any) => {
                  console.log("resp :", resp);
                  // if (!session) return;

                  // setUserSession({
                  //   ...session,
                  //   name: resp.fullName,
                  //   email: resp.email,
                  //   phoneNumber: resp.phoneNumber,
                  //   profilePicture: resp.profilePicture,
                  // });
                  getAdminById(session?.userId || "");

                  toast.success("Profile updated successfully");
                  navigate(absoluteUrls.admin.home.dashboard);
                  close(true);
                },
              }
            );
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

        <PhoneInputField name="phoneNumber" label="Mobile Number" />
      </div>

      <div className="flex justify-end">
        <Button type="submit">Save</Button>
      </div>
    </FormContainer>
  );
}
