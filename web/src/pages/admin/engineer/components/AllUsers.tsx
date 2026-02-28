import CustomTable from "@/shared/components/commonUI/custom_table";
import type { Column } from "@/shared/components/commonUI/custom_table";
import type { ManageEngineerProps } from "../types";
import Popup from "@/shared/components/Popup";
import { useEffect, useMemo, useState } from "react";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import { useAdminManageEngineers } from "@/shared/apiServices/admin/adminOpenApiService";
import ViewFileComponent from "@/pages/admin/engineer/components/ViewFileComponent";
import type { ProfileFileType } from "@/shared/apiServices/commonOpenApiService";
import SelectMenu from "@/shared/components/SelectMenu";
import { documentType } from "../types";

/**
 * AllUsers Component
 *
 * Displays a searchable table of engineers with details such as ID, name, email,
 * location, registration date, KYC and employment status, average rating, and documents.
 * Provides a modal popup to view the documents of a selected engineer.
 *
 * Features:
 * - Search engineers by ID, name, email, or location.
 * - Open document popup for a selected engineer.
 * - Responsive and scrollable table.
 *
 * @component
 * @returns {JSX.Element} The rendered AllUsers component with search, table, and popup.
 */

export default function AllUsers() {
  const [search, setSearch] = useState("");

  const [selectedFile, setSelectedFile] = useState<{
    engineerId: number;
    type: ProfileFileType;
  } | null>(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: engineersResponse, isLoading, isFetching } =
    useAdminManageEngineers({
    page: currentPage,
    limit: pageSize,
  });

  useEffect(() => {
    setSelectedFile(null);
    setIsPreviewOpen(false);
  }, [currentPage, pageSize]);

  const engineerData = (engineersResponse?.data ?? []) as ManageEngineerProps[];

  const selectedEngineer = useMemo(() => {
    if (!selectedFile) return null;
    return engineerData.find((engineer) => engineer.id === selectedFile.engineerId) ?? null;
  }, [engineerData, selectedFile]);

  useEffect(() => {
    if (!selectedFile) return;
    if (isLoading || isFetching) return;
    if (selectedEngineer) return;
    setSelectedFile(null);
    setIsPreviewOpen(false);
  }, [isFetching, isLoading, selectedEngineer, selectedFile]);

  const getFileUrl = () => {
    if (!selectedFile || !selectedEngineer) return null;
    const { type } = selectedFile;

    switch (type) {
      case "profilePicture":
        return selectedEngineer.profilePicture?.url;
      case "resumeFile":
        return selectedEngineer.resumeFile?.url;
      case "govIdDoc":
        return selectedEngineer.govIdDoc?.url;
      case "certificateDoc":
        return selectedEngineer.certificateDoc?.url;
      default:
        return null;
    }
  };

  const columns: Column<ManageEngineerProps>[] = [
    {
      label: "Sr.No.",
      renderCell: (_row: ManageEngineerProps, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    {
      key: "engineerID",
      label: "Engineer ID",
      renderCell: (row: ManageEngineerProps) => {
        const id = row.engineerCode || "N/A";
        return (
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {id}
          </div>
        );
      },
    },
    {
      key: "details",
      label: "Details",
      renderCell: (row) => {
        const initials = row.name?.charAt(0).toUpperCase() || "E";
        return (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0 border border-indigo-200 shadow-sm">
              {row.profilePicture?.url ? (
                <img
                  src={row.profilePicture.url}
                  alt={row.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="flex flex-col">
              <div className="font-semibold">{row.name}</div>
              <div className="text-sm text-gray-500">{row.phoneNumber}</div>
              <div className="text-sm text-gray-500">{row.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: "location",
      label: "Location",
      renderCell: (row) => (
        <div className="text-sm text-gray-900 dark:text-white">
          {row.location ??
            ([row.cityName ?? "", row.countryName ?? ""]
              .filter(Boolean)
              .join(", ") ||
              "N/A")}
        </div>
      ),
    },
    {
      key: "registrationDate",
      label: "Registration Date",
      renderCell: (row) => (
        <div className="text-center text-sm text-gray-900 dark:text-white">
          {row.registrationDate
            ? new Date(row.registrationDate).toLocaleDateString()
            : "N/A"}
        </div>
      ),
    },
    {
      key: "kycStatus",
      label: "KYC Status",
      renderCell: (row) => (
        <div className="text-center text-sm text-gray-900 dark:text-white">
          {row.profileStatus?.toUpperCase() ?? "N/A"}
        </div>
      ),
    },
    {
      key: "employmentStatus",
      label: "Employment Status",
      renderCell: (row) => (
        <div className="text-center text-sm text-gray-900 dark:text-white">
          {(row.isEmployed ? "Employed" : "Unemployed").toUpperCase()}
        </div>
      ),
    },
    {
      key: "avgRating",
      label: "Avg Rating",
      renderCell: (row) => (
        <div className="text-center text-sm text-gray-900 dark:text-white">
          {(row.averageRating ?? 0).toFixed(1)}
        </div>
      ),
    },
    {
      key: "documentType",
      label: "View Documents",
      renderCell: (row: ManageEngineerProps) => (
        <SelectMenu
          placeholder="Select Document"
          className="w-36"
          options={documentType.map((item) => ({
            value: item.value ?? "",
            label: item.label ?? "",
          }))}
          value={selectedFile?.engineerId === row.id ? selectedFile.type : null}
          onChange={(value) => {
            if (!value) {
              setSelectedFile(null);
              setIsPreviewOpen(false);
              return;
            }

            setSelectedFile({
              engineerId: row.id,
              type: value as ProfileFileType,
            });
            setIsPreviewOpen(true);
          }}
        />
      ),
    },
  ];

  return (
    <div>
      <div className="px-2 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-gray-700 rounded-md gap-2">
        <div className="flex flex-wrap gap-4 items-center">
          <SearchInput value={search} onChange={setSearch} />
        </div>
        <div className="h-full flex-1 overflow-y-auto">
          <CustomTable<ManageEngineerProps>
            columns={columns}
            data={engineerData}
            initialPageSize={pageSize}
            currentPage={currentPage}
            totalCount={engineersResponse?.total ?? 0}
            loading={isLoading || isFetching}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>
      <Popup open={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
        {selectedFile && selectedEngineer && (
          <ViewFileComponent
            onClose={() => setIsPreviewOpen(false)}
            fileType={selectedFile.type}
            userId={selectedEngineer.userId}
            fileUrl={getFileUrl()}
            title={`${selectedEngineer.name}'s`}
          />
        )}
      </Popup>
    </div>
  );
}
