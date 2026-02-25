import { absoluteUrls } from "@/config/urls";
import { type AdminGetSubAdminsResponses } from "@/api";
import { useAdminGetSubAdmins } from "@/shared/apiServices/admin/adminOpenApiService";
import { Button } from "@/shared/components/commonUI/Buttons";
import CustomTable, {
  type Column,
} from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import { usePopupStore } from "@/shared/store/popupStore";
import { useState  } from "react";
import { CiEdit } from "react-icons/ci";
import { FaUserShield } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
  const [page] = useState(1);

  const { data } = useAdminGetSubAdmins({
    page,
    limit: 10,
    search: search || undefined,
  });

  const subAdmins = data?.data ?? [];
  type SubAdminItem = AdminGetSubAdminsResponses[200]["data"][number];
  const handleDisableSubAdmin = async (row: SubAdminItem) => {
    await showPopup({
      title: "Disable Sub-Admin",
      body: "Are you sure you want to disable this sub-admin?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Disable",
          value: "disable",
          variant: "danger",
          action: async (close) => {
            console.log("Disabling sub-admin:", row.id);
            toast.success("Sub-admin disabled successfully!");
            close(true);
          },
        },
      ],
    });
  };

  const columns: Column<SubAdminItem>[] = [
    {
      key: "id",
      label: "Sr.No.",
      renderCell: (row) => <span>{row.id}</span>,
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
      renderCell: (row) => <span>{row.phoneNumber}</span>,
    },
    {
      key: "regionName",
      label: "Region",
      renderCell: (row) => <span>{row.regionName ?? "—"}</span>,
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
            className="p-2 bg-red-100 rounded-md cursor-pointer"
            onClick={() => handleDisableSubAdmin(row)}
          >
            <FaUserShield className="text-red-600" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full p-4">
      <div className="flex justify-between items-center">
        <p className="mt-2 mb-6 font-semibold">Manage Sub-Admin</p>
        <div className="flex gap-2">
          <Button
            className="w-fit bg-gradient-to-r from-teal-900 to-teal-700 text-white py-2 px-4 rounded-lg hover:opacity-90 transition"
            onClick={() =>
              navigate(absoluteUrls.admin.home.manage_sub_admin_add)
            }
          >
            Add Sub Admin
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-700 rounded-lg p-4 pb-8 shadow-sm">
        <div className="mb-4">
          <SearchInput value={search} onChange={setSearch} />
        </div>

        <div className="overflow-x-auto">
          <CustomTable<SubAdminItem>
            columns={columns}
            data={subAdmins}
            initialPageSize={10}
          />
        </div>
      </div>
    </div>
  );
}
