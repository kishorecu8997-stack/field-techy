import { manageGroups } from "@/dummy_data/admin/manageGroups";
import { Button } from "@/shared/components/commonUI/Buttons";
import CustomTable, {
  type Column,
} from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import { FiEye } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import type { ManageGroups } from "./type";
import { CiEdit } from "react-icons/ci";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { absoluteUrls } from "@/config/urls";
import { usePopupStore } from "@/shared/store/popupStore";
import { toast } from "react-toastify";
import Popup from "@/shared/components/Popup";
import { IoCloseSharp } from "react-icons/io5";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { TextareaInput } from "@/shared/components/commonUI/inputs";

/**
 * HandleStatus
 *
 * Small toggle component that displays and allows toggling of a boolean status.
 * Shows "On" (green) when true and "Off" (red) when false. Clicking the badge
 * toggles the local state.
 *
 * Props:
 * - `status` (boolean): Initial status value to display.
 *
 * @component
 * @param {{ status: boolean }} props
 * @returns {JSX.Element} A clickable status badge
 */
const HandleStatus = ({ status: value }: { status: boolean }) => {
  const [status, setStatus] = useState<boolean>(value);
  return (
    <div
      className={`flex items-center justify-center w-fit px-4 py-1 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ${
        status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
      onClick={() => setStatus(!status)}
    >
      {status ? "On" : "Off"}
    </div>
  );
};

/**
 * ManageGroupList
 *
 * Admin page component for managing engineer groups. Displays a searchable table
 * of groups with view/edit/delete actions. On deletion, shows a remarks popup
 * to collect deletion feedback before confirming.
 *
 * Features:
 * - Searchable table with group metadata (name, description, engineer count, dates)
 * - Status toggle column (On/Off) for group status
 * - Action buttons: View, Edit, Delete
 * - Delete confirmation popup with remarks form
 * - Navigation to add/view/edit group pages
 *
 * @component
 * @returns {JSX.Element} The manage groups page with table and actions
 */
const ManageGroupList: React.FC = () => {
  const methods = useForm<{ remarks: string }>({
    defaultValues: { remarks: "" },
  });
  const navigate = useNavigate();
  const { showPopup } = usePopupStore();
  const [remarks, setRemarks] = useState<boolean>(false);

  //Delete confirmation handler
  const handleDelete = (row: ManageGroups) => {
    showPopup({
      title: "Delete Group",
      body: "Are you sure you want to delete this group?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Yes",
          value: "yes",
          variant: "danger",
          action: async (close) => {
            console.log("Deleted group:", row);
            setRemarks(true);
            // toast.success("Group deleted successfully");
            close(true);
          },
        },
      ],
    });
  };

  const columns: Column<ManageGroups>[] = [
    { key: "srNo", label: "Sr.No." },
    { key: "groupName", label: "Group Name" },
    { key: "groupDescription", label: "Group Description" },
    { key: "noOfEngineers", label: "No. of Engineers" },
    { key: "createdDate", label: "Created Date" },
    { key: "createdBy", label: "Created By" },
    { key: "updatedDate", label: "Updated Date" },
    { key: "updatedBy", label: "Updated By" },
    {
      key: "status",
      label: "Status",
      renderCell: (row: ManageGroups) => <HandleStatus status={row.status} />,
    },
    {
      key: "action",
      label: "Action",
      renderCell: (row: ManageGroups) => (
        <div className="flex items-center gap-2">
          <div
            className="p-2 bg-yellow-100 rounded-md cursor-pointer"
            onClick={() =>
              navigate(
                `${absoluteUrls.admin.home.manage_groups_view}/${row.srNo}`
              )
            }
          >
            <FiEye className="text-yellow-600" />
          </div>
          <div className="p-2 bg-blue-100 rounded-md cursor-pointer">
            <CiEdit
              className="text-blue-600"
              onClick={() =>
                navigate(
                  `${absoluteUrls.admin.home.manage_groups_edit}/${row.srNo}`
                )
              }
            />
          </div>
          <div className="p-2 bg-red-100 rounded-md cursor-pointer">
            <RiDeleteBin6Line
              className="text-red-600"
              onClick={() => handleDelete(row)}
            />
          </div>
        </div>
      ),
    },
  ];

  const handleSubmit = async (data: { remarks: string }) => {
    console.log("Remarks for deletion:", data.remarks);
    setRemarks(false);
    toast.success("Group deleted successfully");
  };

  return (
    <div className="w-full h-full flex flex-col p-3 gap-3">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold">Manage group</h1>
        <div className="flex gap-4">
          <Button
            type="submit"
            className="w-fit bg-gradient-to-r bg-teal-900 text-white"
            onClick={() => navigate(absoluteUrls.admin.home.manage_groups_add)}
          >
            Add Group
          </Button>
        </div>
      </div>
      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-gray-700 rounded-md gap-2">
        <div className="flex gap-4 items-center">
          <SearchInput />
        </div>
        <div className="h-full flex-1 overflow-y-auto">
          <CustomTable<ManageGroups>
            columns={columns}
            data={manageGroups}
            initialPageSize={10}
          />
        </div>
      </div>
      {remarks && (
        <Popup open={remarks} onClose={() => setRemarks(false)}>
          <div className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-bold">Remarks</span>
              <div
                className="text-xl font-semibold cursor-pointer"
                onClick={() => setRemarks(false)}
              >
                <IoCloseSharp />
              </div>
            </div>
            <FormContainer methods={methods} onSubmit={handleSubmit}>
              <TextareaInput
                name="remarks"
                label="Remarks"
                isShowLabel={false}
              />
              <div className="flex justify-end mt-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRemarks(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-fit rounded-md bg-gradient-to-r bg-teal-900 text-white py-2 hover:opacity-90 transition"
                >
                  Submit
                </Button>
              </div>
            </FormContainer>
          </div>
        </Popup>
      )}
    </div>
  );
};
export default ManageGroupList;
