import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import { FaUserCircle } from "react-icons/fa";
import type { ManageEngineerProps } from "../types";
import { Button } from "@/shared/components/commonUI/Buttons";
import { usePopupStore } from "@/shared/store/popupStore";
import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useAdminManageEngineers } from "@/shared/apiServices/admin/adminOpenApiService";

/**
 * BlockedUser Component
 *
 * Displays a management dashboard for engineers, including:
 * - A search input for filtering results.
 * - A customizable table for viewing detailed engineer data.
 * - Actionable buttons for viewing document details.
 *
 * @component
 * @example
 * return (
 *   <BlockedUser />
 * );
 *
 * @returns {JSX.Element} The rendered BlockedUser component.
 */
export default function BlockedUser() {
  const { showPopup } = usePopupStore();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

    const { data: engineersResponse, isLoading } = useAdminManageEngineers({
      page: currentPage,
      limit: pageSize,
      status: "blocked",
    });

    // Map API response to table rows
    const engineersData: ManageEngineerProps[] = (
      engineersResponse?.data ?? []
    ).map((e) => {
      const latestStatus = e.statusHistory?.sort(
        (a, b) =>
          new Date(b.actionDate).getTime() - new Date(a.actionDate).getTime(),
      )[0];

      return {
        id: e.id,
        userId: e.userId,
        engineerID: e.engineerCode ?? "N/A",
        details: {
          name: e.name ?? "N/A",
          email: e.email ?? "N/A",
          phone: e.phoneNumber ?? "N/A",
        },
        documents: "View",
        submittedDocuments: e.statusHistory?.map((s) => s.type) ?? [],
        location: e.location ?? "N/A",
        registrationDate: e.registrationDate
          ? new Date(e.registrationDate).toLocaleDateString()
          : "N/A",
        walletBalance: e.balance?.toString() ?? "0",
        kycStatus: e.profileStatus,
        employmentStatus: e.isEmployed ? "Employed" : "Unemployed",
        avgRating: e.averageRating ?? 0,
        approvalStatus: e.profileStatus,
        suspendReason: latestStatus?.reason ?? "N/A",
        suspendFrom: latestStatus?.startDate
          ? new Date(latestStatus.startDate).toLocaleDateString()
          : "N/A",
        suspendTo: latestStatus?.endDate
          ? new Date(latestStatus.endDate).toLocaleDateString()
          : "N/A",
        suspendBy: latestStatus?.adminName ?? "N/A",
        suspendOn: latestStatus?.actionDate
          ? new Date(latestStatus.actionDate).toLocaleDateString()
          : "N/A",
        currentStatus: latestStatus
          ? latestStatus.revokedAt
            ? "Revoked"
            : e.userStatus === "blocked"
              ? "Blocked"
              : e.userStatus === "suspended"
                ? "Suspended"
                : latestStatus.type.charAt(0).toUpperCase() +
                  latestStatus.type.slice(1)
          : "Active",
      };
    });

    const filteredData = useMemo(() => {
      const q = search.toLowerCase();
      return engineersData.filter(
        (e) =>
          e.engineerID.toLowerCase().includes(q) ||
          e.details.name.toLowerCase().includes(q) ||
          e.details.email.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q),
      );
    }, [engineersData, search]);

  const handleUnblock = async (id: number) => {
    await showPopup({
      title: "Unblock",
      body: "Are you sure you want to unblock this engineer?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Unblock",
          value: "save",
          variant: "primary",
          action: async (close) => {
            console.log("Unlocking engineer:", id);
            toast.success("Engineer unblocked successfully!");
            close(true);
          },
        },
      ],
    });
  };

  const columns: Column<ManageEngineerProps>[] = [
    { label: "Sr.No.", renderCell: (_row: ManageEngineerProps, index: number) => index + 1 },
    {
      key: "engineerID",
      label: "Engineer ID",
    },
    {
      key: "details",
      label: "Details",
      renderCell: (row: ManageEngineerProps) => {
        return (
          <div className="text-sm flex items-center gap-2">
            <div>
              <FaUserCircle className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
            </div>
            <div>
              <div className="font-semibold">{row.details.name}</div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                {row.details.phone}
              </div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                {row.details.email}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "suspendReason",
      label: "Reason for Block",
    },
    { key: "suspendOn", label: "Blocked On" },
    { key: "suspendBy", label: "Blocked By", dataCellAlign: "center" },
    { key: "currentStatus", label: "Current Status", dataCellAlign: "center" },
    {
      key: "action",
      label: "Actions",
      align: "center",
      renderCell: (row: ManageEngineerProps) => (
        <div
          className="mx-auto text-center"
          onClick={() => handleUnblock(row.id)}
        >
          <Button className="w-fit bg-gradient-to-r bg-teal-900 text-white">
            Unblock
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="px-2 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-gray-700 rounded-md gap-2">
        <div className="flex flex-wrap gap-4 items-center">
          <SearchInput value={search} onChange={setSearch} />
        </div>
        <div className="h-full flex-1 overflow-y-auto ">
          <CustomTable<ManageEngineerProps>
            columns={columns}
            data={filteredData}
            loading={isLoading}
            initialPageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            totalCount={engineersResponse?.total ?? 0}
          />
        </div>
      </div>
    </div>
  );
}
