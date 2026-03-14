import { absoluteUrls } from "@/config/urls";
import { type AdminGetSubAdminsResponses } from "@/api";
import { useAdminGetSubAdmins } from "@/shared/apiServices/admin/adminOpenApiService";
import { Button } from "@/shared/components/commonUI/Buttons";
import CustomTable, {
  type Column,
} from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import { usePopupStore } from "@/shared/store/popupStore";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FaUserShield } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAdminUpdateSubAdmin } from "@/shared/apiServices/admin/adminOpenApiService";

/**
 * `ManageSubAdmin` is a page component for displaying and managing sub-admin users.
 * It features a table of sub-admins with functionality to search, view details,
 * change status, edit, and delete sub-admins. It also provides navigation to
 * add new sub-admins or manage roles.
 * @returns {JSX.Element} The rendered page component.
 */
export default function ManageSubAdmin() {
  const navigate = useNavigate();
  const { showPopup } = usePopupStore();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    setPage(1);
  }, [search, limit]);

  const { data, isLoading } = useAdminGetSubAdmins({
    page,
    limit,
    search: search.trim() || undefined,
  });

  const subAdmins = data?.data ?? [];
  type SubAdminItem = AdminGetSubAdminsResponses[200]["data"][number];
  const totalCount = data?.total ?? 0;
  const updateSubAdminMutation = useAdminUpdateSubAdmin({
    onSuccess: (data) => {
      toast.success(data.message || "Status updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update sub-admin status.");
    },
  });

  const handleToggleSubAdminStatus = async (row: SubAdminItem) => {
    const isActive = row.userStatus === "active";
    const newStatus = isActive ? "inactive" : "active";

    const result = await showPopup({
      title: `${isActive ? "Disable" : "Enable"} Sub-Admin`,
      body: `Are you sure you want to ${isActive ? "disable" : "enable"} this sub-admin?`,
      actionButtons: [
        { label: "Cancel", value: null, variant: "outline" },
        {
          label: isActive ? "Disable" : "Enable",
          value: "confirm",
          variant: isActive ? "danger" : "primary",
        },
      ],
    });

    if (result !== "confirm") return;

    if (row.regionId == null) {
      toast.error(
        "Cannot update status: Region information is missing for this sub-admin.",
      );
      return;
    }

    updateSubAdminMutation.mutate({
      path: { userId: row.userId },
      query: {
        regionId: row.regionId,
      },
      body: { userStatus: newStatus },
    });
  };

  const columns: Column<SubAdminItem>[] = [
    {
      key: "srNo",
      label: "Sr.No.",
      renderCell: (_row, index) => (page - 1) * limit + index + 1,
    },
    {
      key: "name",
      label: "Name",
      renderCell: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs">
            👤
          </div>
          <span>{row.name}</span>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      renderCell: (row) => <span>{row.email}</span>,
    },
    {
      key: "phoneNumber",
      label: "Phone Number",
      renderCell: (row) => <span>{row.phoneNumber || "—"}</span>,
    },
    {
      key: "regionName",
      label: "Region",
      renderCell: (row) => <span>{row.regionName || "—"}</span>,
    },
    {
      key: "action",
      label: "Action",
      renderCell: (row) => (
        <div className="flex items-center gap-2">
          <div
            className="p-2 bg-blue-100 rounded-md cursor-pointer"
            onClick={() =>
              navigate(
                `${absoluteUrls.admin.home.manage_sub_admin_edit}/${row.id}`,
              )
            }
          >
            <CiEdit className="text-blue-600" />
          </div>
          <div
            className={`p-2 rounded-md cursor-pointer ${
              row.userStatus === "active" ? "bg-green-100" : "bg-red-100"
            }`}
            onClick={() => handleToggleSubAdminStatus(row)}
            role="button"
            tabIndex={0}
            aria-label={
              row.userStatus === "active"
                ? "Disable sub-admin"
                : "Enable sub-admin"
            }
          >
            <FaUserShield
              className={
                row.userStatus === "active" ? "text-green-600" : "text-red-600"
              }
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full flex flex-col flex-1 overflow-hidden p-4">
      <div className="flex justify-between items-center">
        <p className="mt-2 mb-6 font-semibold">Manage Sub-Admin</p>
        <div className="flex gap-2">
          <Button
            className="w-fit bg-gradient-to-r bg-teal-900 text-white py-1 rounded-lg hover:opacity-90 transition"
            onClick={() =>
              navigate(absoluteUrls.admin.home.manage_sub_admin_add)
            }
          >
            Add Sub Admin
          </Button>
        </div>
      </div>

      <div className="bg-white flex flex-col flex-1 dark:bg-gray-700 rounded-lg p-4 pb-8 shadow-sm overflow-hidden">
        <div className="mb-4">
          <SearchInput value={search} onChange={setSearch} />
        </div>

        <div className="h-full flex-1 overflow-hidden my-4">
          <CustomTable<SubAdminItem>
            columns={columns}
            data={subAdmins}
            loading={isLoading}
            initialPageSize={limit}
            onPageSizeChange={setLimit}
            totalCount={totalCount}
            currentPage={page}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
