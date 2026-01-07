import { validateName } from "@/pages/engineer/user_profile/Validate";
import { Button } from "@/shared/components/commonUI/Buttons";
import { validateEmailRules } from "@/shared/components/commonUI/emailValidation";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import ImageUploaderField from "@/shared/components/commonUI/inputs/ImageUploaderField";
import PhoneInputField from "@/shared/components/commonUI/inputs/PhoneInputField";
import { useForm } from "react-hook-form";
import type { ProfileFormData } from "./types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { absoluteUrls } from "@/config/urls";
import { usePopupStore } from "@/shared/store/popupStore";
import {
  useUserSessionStore,
  type UserSession,
} from "@/shared/store/useUserSessionStore";
import {
  useAdminUpdateProfileMutation,
  useAdminUploadFileMutation,
} from "@/shared/apiServices/admin/adminService";
import { useState } from "react";

/**
 * `PersonalDetails` is a component that renders a form for updating a user's personal information.
 * It includes fields for name, email, phone number, and a profile image.
 * The component uses `react-hook-form` for state management and validation.
 *
 * **Note:** This component currently initializes with empty default values. For a real-world
 * application, it should fetch the current user's data and populate the form with it.
 *
 * @returns {JSX.Element} The rendered personal details form.
 */
export default function PersonalDetails() {
  const navigate = useNavigate();
  const setUserSession = useUserSessionStore((s) => s.setSession);
  const session = useUserSessionStore((s) => s.session);
  const { showPopup } = usePopupStore();

  const adminUpdateProfileMutation = useAdminUpdateProfileMutation();
  const methods = useForm<ProfileFormData>({
    defaultValues: {
      fullName: session?.name,
      email: session?.email,
      phoneNumber: session?.phoneNumber,
      profilePicture: null,
    },
  });

  const [, setUploadingDoc] = useState<string | null>(null);
  const [, setUploadProgress] = useState<Record<string, number>>({});
  const [profilePictureId, setProfilePictureId] = useState<string | null>(null);
  // console.log("profilePictureId :", profilePictureId);

  const { mutateAsync: updateProfileMutation } = useAdminUploadFileMutation({
    onSuccess: () => {
      setUploadingDoc(null);
      toast.success("Profile picture updated successfully");
    },
    onError: (error) => {
      setUploadingDoc(null);
      toast.error("Failed to upload profile picture");
      console.log("error :", error);
    },
  });

  const handleSubmit = async (data: any) => {
    // console.log("data 135468:", data);

    const getFileFromProfilePicture = async (
      profilePicture: File | string
    ): Promise<File | null> => {
      if (profilePicture instanceof File) {
        return profilePicture;
      }

      if (typeof profilePicture === "string") {
        const response = await fetch(profilePicture);
        const blob = await response.blob();

        return new File([blob], "avatar.jpeg", { type: blob.type });
      }

      return null;
    };

    if (data.profilePicture) {
      setUploadingDoc("ADM_PROFILE_PIC");

      const fileToUpload = await getFileFromProfilePicture(data.profilePicture);

      if (!fileToUpload) return;

      const res: any = await updateProfileMutation({
        adminId: session?.userId || "",
        file: fileToUpload,
        fileType: "ADM_PROFILE_PIC",
        onUploadProgress: (progress: any) => {
          if (progress.percentage) {
            setUploadProgress((prev) => ({
              ...prev,
              ADM_PROFILE_PIC: progress.percentage!,
            }));
          }
        },
      });

      setProfilePictureId(res.fileKey);
      console.log("res upload profile pic :", res);
    }

    await showPopup({
      title: "Profile Update",
      body: "Are you sure you want to update this profile?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Yes, update",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            await adminUpdateProfileMutation.mutateAsync(
              {
                id: session?.userId || "",
                profilePicture: profilePictureId,
                fullName: data.fullName,
                email: data.email,
                phoneNumber: data.phoneNumber,
              },
              {
                onSuccess: (data) => {
                  const resp = data as ProfileFormData;
                  if (!session) return;
                  const sessionUpdate: UserSession = {
                    ...session,
                    email: resp.email,
                    name: resp.fullName,
                    phoneNumber: resp.phoneNumber,
                  };
                  setUserSession(sessionUpdate);
                  toast.success("Profile updated successfully");
                  navigate(absoluteUrls.admin.home.dashboard);
                  close(true);
                },
                onError: (error) => {
                  console.log("error :", error);
                },
              }
            );
          },
        },
      ],
    });
  };

  return (
    <div>
      <FormContainer
        methods={methods}
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 mt-2 px-2 pb-4 w-full"
      >
        <div className="mb-4 w-fit">
          <ImageUploaderField label="Profile Image" name="profilePicture" />
        </div>
        <div className="flex gap-4 w-full">
          <div className="flex-1">
            <InputField
              name="fullName"
              label="Name"
              type="text"
              placeholder="Enter Name"
              required
              allowedCharacters="string"
              rules={{ validate: (v: string) => validateName(v) }}
            />
          </div>

          <div className="flex-1">
            <InputField
              name="email"
              label="Email Address"
              type="text"
              required
              rules={validateEmailRules}
            />
          </div>

          <div className="flex-1">
            <PhoneInputField name="phoneNumber" label="Mobile Number" />
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <Button
            type="submit"
            className="w-fit bg-gradient-to-r bg-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Save
          </Button>
        </div>
      </FormContainer>
    </div>
  );
}
