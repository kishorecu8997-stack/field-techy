import { absoluteUrls } from "@/config/urls";
import {
  manageGroups,
  SelectEngineer,
  type SelectEngineerProps,
} from "@/dummy_data/admin/manageGroups";
import { Button } from "@/shared/components/commonUI/Buttons";
import {
  CustomTable,
  type Column,
} from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import Popup from "@/shared/components/Popup";
import { usePopupStore } from "@/shared/store/popupStore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaUserCircle } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import type { AddGroup } from "../type";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { validateGroupName } from "@/utils/validate";

/**
 * EditGroup
 *
 * Page component for editing an existing engineer group. Allows the user to
 * update the group name and description, and manage engineers within the group
 * (view documents, add new engineers, remove existing engineers).
 * Utilizes a form with validation and a table for managing engineers.
 * @component
 * @returns {JSX.Element} The edit group form page with engineer management
 */
export default function EditGroup() {
  const { showPopup } = usePopupStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const editGroup = manageGroups.find((item) => item.srNo === Number(id));

  const methods = useForm({
    defaultValues: {
      groupName: editGroup?.groupName || "",
      groupDescription: editGroup?.groupDescription || "",
    },
  });

  const columns: Column<SelectEngineerProps>[] = [
    { key: "id", label: "Sr.No." },
    {
      key: "engineerID",
      label: "Engineer ID",
    },
    {
      key: "details",
      label: "Details",
      renderCell: (row: SelectEngineerProps) => {
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
      key: "documents",
      label: "View Documents",
      align: "center",
      renderCell: (row: SelectEngineerProps) => {
        const name = row.documents || "N/A";
        return (
          <div className="mx-auto text-center">
            <Button
              className="w-fit bg-gradient-to-r p-4 bg-teal-900 text-white"
              onClick={() => {
                setIsModalOpen(true);
                setSelectedRowId(row.id);
              }}
            >
              {name}
            </Button>
          </div>
        );
      },
    },
    {
      key: "location",
      label: "Location",
    },
    {
      key: "registrationDate",
      label: "Registration Date",
    },
    {
      key: "walletBalance",
      label: "Wallet Balance",
    },
    {
      key: "kycStatus",
      label: "KYC Status",
    },
    {
      key: "employmentStatus",
      label: "Employment Status",
    },
    {
      key: "avgRating",
      label: "Avg Rating",
    },
    {
      key: "actions",
      label: "Actions",
      renderCell: (row: SelectEngineerProps) => (
        <div className="flex items-center gap-2">
          <div className="p-2 bg-red-100 rounded-md cursor-pointer">
            <IoIosRemoveCircleOutline
              className="text-red-600"
              onClick={() => handleRemove(row)}
            />
          </div>
        </div>
      ),
    },
  ];

  const handleRemove = (row: SelectEngineerProps) => {
    showPopup({
      title: "Remove Engineer",
      body: (
        <>
          Are you sure you want to remove engineer{" "}
          <strong>{row.details.name}</strong> from the group?
        </>
      ),
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
            console.log("Deleting engineer:", row.id);
            toast.success("Engineer removed successfully");
            close(true);
          },
        },
      ],
    });
  };

  const handleSubmit = async (data: AddGroup) => {
    showPopup({
      title: "Update Group",
      body: "Are you sure you want to update this group?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Yes",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            console.log("Submitted data:", data);
            toast.success("Group updated successfully");
            methods.reset();
            setIsModalOpen(false);
            navigate(absoluteUrls.admin.home.manage_groups);
            close(true);
          },
        },
      ],
    });
  };

  return (
    <div className="w-full h-full  flex flex-col p-3">
      <div className="flex justify-between mb-2 items-center">
        <h1 className="font-semibold">Edit group</h1>
        <div className="flex gap-4">
          <Button variant="solid" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </div>
      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-gray-700 rounded-md gap-2">
        <FormContainer
          methods={methods}
          className="flex flex-col gap-2"
          onSubmit={handleSubmit}
        >
          <div className="grid md:flex gap-4">
            <InputField
              name="groupName"
              label="Group Name"
              required
              placeholder="Enter Group Name"
              rules={{ validate: (v: string) => validateGroupName(v) }}
            />
            <InputField
              name="groupDescription"
              label="Group Description"
              placeholder="Enter Group Description"
              rules={{
                maxLength: {
                  value: 200,
                  message: "Description must be at most 200 characters",
                },
              }}
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="font-semibold">Engineers</div>
            <div className="flex gap-2 items-center">
              <SearchInput />
              <Button
                className="w-fit bg-gradient-to-r bg-teal-900 text-white py-1 rounded-md hover:opacity-90 transition"
                onClick={() =>
                  navigate(
                    `${absoluteUrls.admin.home.manage_groups_addEngineer}/${id}`,
                  )
                }
              >
                Add Engineer
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto ">
            <CustomTable<SelectEngineerProps>
              columns={columns}
              data={SelectEngineer}
              initialPageSize={10}
            />
          </div>
          <div className="flex justify-end mt-2">
            <Button
              type="submit"
              className="mr-0 w-fit bg-gradient-to-r bg-teal-900 text-white"
            >
              Save
            </Button>
          </div>
        </FormContainer>
      </div>
      <Popup open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-4">
          <div className="flex justify-between items-center">
            <span className="font-bold">View File {selectedRowId}</span>
            <div
              className="text-xl font-semibold cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            >
              <IoCloseSharp />
            </div>
          </div>
          <div className="border border-gray-400 h-36 my-6">
            <img src="https://via.placeholder.com/500" alt="file" />
          </div>
        </div>
      </Popup>
    </div>
  );
}
