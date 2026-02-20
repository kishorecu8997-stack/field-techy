import React, { useState, useEffect } from "react";
import AdminTabComponent from "@/shared/components/AdminTabComponent";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormProvider, useForm } from "react-hook-form";
import { absoluteUrls } from "@/config/urls";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import type {
  ClientFormData,
  ClientFormProps,
  ExtendedClientResponse,
} from "../types";
import { toast } from "react-toastify";
import { usePopupStore } from "@/shared/store/popupStore";
import ClientAdd from "./ClientAdd";
import Documents from "./Documents";
import {
  useAdminAddClient,
  useAdminUpdateClient,
  useAdminGetClientByUserId,
} from "@/shared/apiServices/admin/adminOpenApiService";
import { useAppMarkProfileFileUploaded } from "@/shared/apiServices/commonOpenApiService";
import { extractErrorMessage } from "@/shared/libs/utils";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/apiServices/queryKeys";
import type {
  AdminUpdateClientData,
  AdminCreateClientData,
  AppMarkProfileFileUploadedData,
} from "@/api";

/**
 * ClientForm component serves as the main form for adding, editing, or viewing client details in the admin panel.
 * It uses a tabbed interface to separate basic information and document uploads.
 * The form is built using `react-hook-form` for state management and validation.
 */
const ClientForm: React.FC<ClientFormProps> = ({ isEdit: propIsEdit }) => {
  const [activeTab, setActiveTab] = useState("Basic Information");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { showPopup } = usePopupStore();
  const queryClient = useQueryClient();

  const isEdit =
    propIsEdit ||
    location.pathname.includes("edit") ||
    location.pathname.includes("view");
  const typeParam = searchParams.get("type") as "corporate" | "home" | null;
  const userIdFromUrl = searchParams.get("userId");
  const isView = searchParams.get("view") === "true";

  /* ---------- Data Mapping Helper ---------- */
  const mapClientDetailToFormData = (
    detail: ExtendedClientResponse,
  ): ClientFormData => ({
    clientType: detail.clientType,
    profileImage: detail.profilePicture?.url || null,
    companyName: detail.companyName || "",
    phoneNumber: detail.phoneNumber,
    email: detail.email,
    industry: detail.industryId ?? "",
    country: detail.countryId ?? "",
    city: detail.cityId ?? "",
    taxDocument: detail.documentType || "",
    contactPersonName: detail.personName || "",
    businessType: detail.businessTypeId ?? "",
    address: detail.address || "",
    state: detail.stateId ?? "",
    postalCode: detail.postalCode || "",
    vatRegistrationNumber: detail.vatRegistrationNumber || "",
    govIdDoc: detail.govIdDoc?.url || null,
    certificate: detail.certificateDoc?.url || null,
  });

  const { data: clientDetail, isLoading: isDetailLoading } =
  useAdminGetClientByUserId(userIdFromUrl || "", {
      enabled: !!userIdFromUrl && (isEdit || isView),
      refetchOnMount: "always",
    });

  const formValues = clientDetail
    ? mapClientDetailToFormData(clientDetail as ExtendedClientResponse)
    : undefined;

  const methods = useForm<ClientFormData>({
    mode: "onChange",
    values: formValues,
    defaultValues: {
      clientType: (typeParam || "corporate") as "corporate" | "home",
      profileImage: null,
      companyName: "",
      phoneNumber: "",
      email: "",
      industry: "",
      country: "",
      city: "",
      taxDocument: "",
      contactPersonName: "",
      businessType: "",
      address: "",
      state: "",
      postalCode: "",
      vatRegistrationNumber: "",
      govIdDoc: null,
      certificate: null,
    },
  });

  const { trigger, getValues, watch, setValue, reset } = methods;
  const clientType = watch("clientType");

  /* ---------- Hooks & Queries ---------- */
  const { mutateAsync: addClient } = useAdminAddClient();
  const { mutateAsync: updateClient } = useAdminUpdateClient();
  const { mutateAsync: markFileUploaded } = useAppMarkProfileFileUploaded();

  // Update form values when clientDetail is loaded
  useEffect(() => {
    if (clientDetail) {
      reset(mapClientDetailToFormData(clientDetail as ExtendedClientResponse));
    } else if (typeParam && !isEdit) {
      setValue("clientType", typeParam);
    }
  }, [clientDetail, typeParam, isEdit, setValue, reset]);

  const getBasicFields = (
    type: "corporate" | "home" | null,
  ): (keyof ClientFormData)[] => {
    const commonFields: (keyof ClientFormData)[] = [
      "clientType",
      "phoneNumber",
      "email",
      "contactPersonName",
      "country",
      "city",
      "state",
      "postalCode",
    ];
    if (type === "corporate") {
      return [
        ...commonFields,
        "companyName",
        "industry",
        "businessType",
        "address",
        "vatRegistrationNumber",
        "taxDocument",
      ];
    }
    return commonFields;
  };

  const handleNext = async () => {
    if (activeTab === "Basic Information") {
      const basicFields = getBasicFields(clientType);
      if (isView || (await trigger(basicFields))) setActiveTab("Documents");
    }
  };

  const handleSaveConfirmation = async (data: ClientFormData) => {
    if (isView) return;
    await showPopup({
      title: isEdit ? "Update Client" : "Add Client",
      body: `Are you sure you want to ${isEdit ? "update" : "save"} this details?`,
      actionButtons: [
        { label: "Cancel", value: null, variant: "outline" },
        {
          label: isEdit ? "Update" : "Save",
          value: "save",
          variant: "primary",
          action: async (close) => {
            try {
              const extractFile = (val: unknown): File | null => {
                if (val instanceof File) return val;
                if (typeof FileList !== "undefined" && val instanceof FileList && val.length > 0) return val[0];
                return null;
              };

              const fileMap = {
                profilePicture: extractFile(data.profileImage),
                govIdDoc: extractFile(data.govIdDoc),
                certificateDoc: extractFile(data.certificate),
              };

              const toNum = (val: unknown): number | undefined => {
                if (val === null || val === undefined || val === "") return undefined;
                const n = Number(val);
                return isNaN(n) ? undefined : n;
              };

              // Map form data to API body, omitting internal/mismatched fields
              const {
                contactPersonName,
                taxDocument,
                country,
                state,
                city,
                industry,
                businessType,
                ...rest
              } = data;

              // Remove fields that should not be in the base rest spread (sent as strings)
              const cleanRest = rest as Record<string, unknown>;
              delete cleanRest.profileImage;
              delete cleanRest.govIdDoc;
              delete cleanRest.certificate;

              const body: Record<string, unknown> = {
                ...cleanRest,
                personName: contactPersonName,
                name: contactPersonName || data.email?.split("@")[0] || "Client",
                countryId: toNum(country),
                stateId: toNum(state),
                cityId: toNum(city),
                industryId: toNum(industry),
                businessTypeId: toNum(businessType),
                documentType: taxDocument,
              };

              // Helper for file metadata
              const mapFile = (file: File | null, originalValue: unknown) => {
                if (file) {
                  return {
                    filename: file.name,
                    size: file.size,
                    mimeType: file.type,
                  };
                }
                return originalValue === null ? null : undefined;
              };

              const pp = mapFile(fileMap.profilePicture, data.profileImage);
              if (pp !== undefined) body.profilePicture = pp;

              const gd = mapFile(fileMap.govIdDoc, data.govIdDoc);
              if (gd !== undefined) body.govIdDoc = gd;

              const cd = mapFile(fileMap.certificateDoc, data.certificate);
              if (cd !== undefined) body.certificateDoc = cd;

              const finalUserId = toNum(userIdFromUrl);

              let response;
              if (isEdit) {
                if (!finalUserId) throw new Error("User ID is missing.");
                response = await updateClient({
                  body: { ...body, userId: finalUserId },
                } as AdminUpdateClientData);
              } else {
                response = await addClient({ body: body } as AdminCreateClientData);
              }

              // Handle uploads
              if (response && "uploadUrls" in response && response.uploadUrls) {
                const urls = response.uploadUrls as Record<
                  string,
                  { uploadUrl: string; fileId: number }
                >;
                for (const [key, { uploadUrl, fileId }] of Object.entries(
                  urls,
                )) {
                  const typedKey = key as keyof typeof fileMap;
                  const file = fileMap[typedKey];
                  if (!file) continue;

                  const uploadRes = await fetch(uploadUrl, {
                    method: "PUT",
                    body: file,
                    headers: { "Content-Type": file.type },
                  });

                  if (uploadRes.ok) {
                    await markFileUploaded({
                      body: { fileId },
                      headers: { authorization: "" },
                    } as AppMarkProfileFileUploadedData);
                  }
                }
              }
              await queryClient.resetQueries({
                queryKey: queryKeys.admin.manageClients,
                exact: false,
              });
              await queryClient.resetQueries({
                queryKey: ["adminGetClient"],
                exact: false,
              });

              toast.success(
                `Client information ${isEdit ? "updated" : "saved"} successfully!`,
              );
              navigate(absoluteUrls.admin.home.manage_client);
              close(true);
            } catch (error) {
              toast.error(extractErrorMessage(error, "Failed to save client information."));
              close(false);
            }
          },
        },
      ],
    });
  };

  const handleSave = async () => {
    if (await trigger()) {
      setIsSubmitting(true);
      try {
        await handleSaveConfirmation(getValues());
      } finally {
        setIsSubmitting(false);
      }
    } else {
      const errors = methods.formState.errors;
      const basicFields = getBasicFields(clientType);
      if (basicFields.some((f) => errors[f])) setActiveTab("Basic Information");
      toast.error("Please fix the errors in the form before saving.");
    }
  };

  const tabs = [
    {
      label: "Basic Information",
      content: <ClientAdd isEdit={isEdit} isView={isView} />,
    },
    {
      label: "Documents",
      content: <Documents isView={isView} />,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col p-3 gap-3 overflow-hidden">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-lg text-gray-800 dark:text-white">
          {isView
            ? "View Client Details"
            : isEdit
              ? clientType === "corporate"
                ? "Corporate Client"
                : "Home Client"
              : "Add Client"}
        </h1>
        <Button
          variant="solid"
          onClick={() => navigate(absoluteUrls.admin.home.manage_client)}
          className="bg-teal-900"
        >
          Back
        </Button>
      </div>

      {isDetailLoading ? (
        <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <p className="text-gray-500">Loading client details...</p>
          </div>
        </div>
      ) : (
        <FormProvider {...methods}>
          <div className="bg-white dark:bg-gray-800  flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <AdminTabComponent
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/50">
              {activeTab === "Documents" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("Basic Information")}
                  disabled={isSubmitting}
                  className="px-6 py-2"
                >
                  Previous
                </Button>
              )}
              <Button
                type="button"
                onClick={
                  activeTab === "Documents"
                    ? isView
                      ? () => navigate(-1)
                      : handleSave
                    : handleNext
                }
                disabled={isSubmitting}
                className="px-8 py-2 bg-gradient-to-r from-teal-700 to-teal-900 text-white rounded-lg hover:from-teal-800 hover:to-teal-950 transition-all font-medium min-w-[140px]"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">Processing...</span>
                ) : activeTab === "Documents" ? (
                  isView ? (
                    "Back to List"
                  ) : isEdit ? (
                    "Update Client"
                  ) : (
                    "Save Client"
                  )
                ) : (
                  "Next Step"
                )}
              </Button>
            </div>
          </div>
        </FormProvider>
      )}
    </div>
  );
};

export default ClientForm;
