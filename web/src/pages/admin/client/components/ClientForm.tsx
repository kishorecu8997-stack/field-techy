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
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";

const DEFAULT_FORM_VALUES: Partial<ClientFormData> = {
  companyName: "",
  phoneNumber: "",
  email: "",
  industry: "",
  country: "",
  city: "",
  documentType: "",
  contactPersonName: "",
  businessType: "",
  address: "",
  state: "",
  postalCode: "",
  documentNumber: "",
  profileImage: null,
  govIdDoc: null,
  certificate: null,
};

const mapToFormData = (detail: ExtendedClientResponse): ClientFormData => ({
  ...(DEFAULT_FORM_VALUES as ClientFormData),
  clientType: detail.clientType,
  profileImage: detail.profilePicture?.url || null,
  companyName: detail.companyName || "",
  phoneNumber: detail.phoneNumber,
  email: detail.email,
  industry: detail.industryId ?? "",
  country: detail.countryId ?? "",
  city: detail.cityId ?? "",
  documentType: detail.documentType || "",
  contactPersonName: detail.personName || "",
  businessType: detail.businessTypeId ?? "",
  address: detail.address || "",
  state: detail.stateId ?? "",
  postalCode: detail.postalCode || "",
  documentNumber: detail.documentNumber || "",
  govIdDoc: detail.govIdDoc?.url || null,
  certificate: detail.certificateDoc?.url || null,
});

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
  const userIdFromUrl = searchParams.get("userId");
  const isView = searchParams.get("view") === "true";
  const typeParam = searchParams.get("type") as "corporate" | "home" | null;

  const { data: clientDetail, isLoading: isDetailLoading } =
    useAdminGetClientByUserId(userIdFromUrl || "", {
      enabled: !!userIdFromUrl && (isEdit || isView),
      refetchOnMount: "always",
    });

  const methods = useForm<ClientFormData>({
    mode: "onChange",
    defaultValues: {
      ...DEFAULT_FORM_VALUES,
      clientType: typeParam || "corporate",
    } as ClientFormData,
  });

  const {
    trigger,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = methods;
  const clientType = watch("clientType");

  const { mutateAsync: addClient } = useAdminAddClient();
  const { mutateAsync: updateClient } = useAdminUpdateClient();
  const { mutateAsync: markFileUploaded } = useAppMarkProfileFileUploaded();

  useEffect(() => {
    if (clientDetail)
      reset(mapToFormData(clientDetail as ExtendedClientResponse));
  }, [clientDetail, reset]);

  const getBasicFields = (): (keyof ClientFormData)[] => {
    const common: (keyof ClientFormData)[] = [
      "clientType",
      "phoneNumber",
      "email",
      "contactPersonName",
      "country",
      "city",
      "state",
      "postalCode",
    ];
    return clientType === "corporate"
      ? [
          ...common,
          "companyName",
          "industry",
          "businessType",
          "address",
          "documentNumber",
          "documentType",
        ]
      : common;
  };

  const toNum = (val: unknown) =>
    val && !isNaN(Number(val)) ? Number(val) : undefined;

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
              const extractF = (v: unknown) =>
                v instanceof File ? v : (v instanceof FileList && v[0]) || null;
              const files = {
                profilePicture: extractF(data.profileImage),
                govIdDoc: extractF(data.govIdDoc),
                certificateDoc: extractF(data.certificate),
              };

              const body: Record<string, unknown> = {
                ...(data as unknown as Record<string, unknown>),
                personName: data.contactPersonName,
                name:
                  data.contactPersonName ||
                  data.email?.split("@")[0] ||
                  "Client",
                countryId: toNum(data.country),
                stateId: toNum(data.state),
                cityId: toNum(data.city),
                industryId: toNum(data.industry),
                businessTypeId: toNum(data.businessType),
                documentType: data.documentType,
              };

              [
                "profileImage",
                "govIdDoc",
                "certificate",
                "contactPersonName",
                "taxDocument",
                "country",
                "state",
                "city",
                "industry",
                "businessType",
              ].forEach((k) => delete body[k]);

              Object.entries(files).forEach(([k, f]) => {
                if (f)
                  body[k] = {
                    filename: f.name,
                    size: f.size,
                    mimeType: f.type,
                  };
                else if (
                  data[
                    k === "certificateDoc"
                      ? "certificate"
                      : (k as keyof ClientFormData)
                  ] === null
                )
                  body[k] = null;
              });

              const res = isEdit
                ? await updateClient({
                    path: { userId: toNum(userIdFromUrl)! },
                    body: body as AdminUpdateClientData["body"],
                  })
                : await addClient({ body } as AdminCreateClientData);

              if (res && "uploadUrls" in res && res.uploadUrls) {
                const uploadUrls = res.uploadUrls as Record<
                  string,
                  { uploadUrl: string; fileId: number }
                >;
                for (const [key, { uploadUrl, fileId }] of Object.entries(
                  uploadUrls,
                )) {
                  const file = files[key as keyof typeof files];
                  if (!file) continue;
                  if (
                    (
                      await fetch(uploadUrl, {
                        method: "PUT",
                        body: file,
                        headers: { "Content-Type": file.type },
                      })
                    ).ok
                  ) {
                    await markFileUploaded({
                      body: { fileId },
                      headers: { authorization: "" },
                    } as AppMarkProfileFileUploadedData);
                  }
                }
              }
              await queryClient.invalidateQueries({
                queryKey: queryKeys.admin.manageClients,
              });
              await queryClient.invalidateQueries({
                queryKey: queryKeys.admin.adminGetClient,
              });
              toast.success(
                `Client information ${isEdit ? "updated" : "saved"} successfully!`,
              );
              navigate(absoluteUrls.admin.home.manage_client);
              close(true);
            } catch (error) {
              toast.error(extractErrorMessage(error, "Failed to save client."));
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
      if (getBasicFields().some((f) => errors[f]))
        setActiveTab("Basic Information");
      toast.error("Please fix errors before saving.");
    }
  };

  const tabs = [
    {
      label: "Basic Information",
      content: <ClientAdd isEdit={isEdit} isView={isView} />,
    },
    { label: "Documents", content: <Documents isView={isView} /> },
  ];

  if (isDetailLoading) return <LoaderComponent />;

  return (
    <div className="w-full h-full flex flex-col p-3 gap-3 overflow-hidden">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-gray-800 dark:text-white">
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

      <FormProvider {...methods}>
        <div className="bg-white dark:bg-gray-800 flex flex-col flex-1 overflow-hidden">
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
                  : async () =>
                      (isView || (await trigger(getBasicFields()))) &&
                      setActiveTab("Documents")
              }
              disabled={isSubmitting}
              className="px-8 py-2 bg-gradient-to-r from-teal-700 to-teal-900 text-white rounded-lg hover:from-teal-800 hover:to-teal-950 transition-all font-medium min-w-[140px]"
            >
              {isSubmitting
                ? "Processing..."
                : activeTab === "Documents"
                  ? isView
                    ? "Back to List"
                    : isEdit
                      ? "Update Client"
                      : "Save Client"
                  : "Next Step"}
            </Button>
          </div>
        </div>
      </FormProvider>
    </div>
  );
};

export default ClientForm;
