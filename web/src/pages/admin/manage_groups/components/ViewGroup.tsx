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
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaUserCircle } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";

/**
 * ViewGroup
 *
 * Page component for viewing details of an existing engineer group in read-only mode.
 * Displays group name, description, and a list of engineers in the group with their
 * metadata. Provides an Edit button to navigate to the edit page and a documents
 * viewing modal.
 * @component
 * @returns {JSX.Element} The view group page with read-only details and engineer list
 */
export default function ViewGroup() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const viewGroup = manageGroups.find((item) => item.srNo === Number(id));

  const methods = useForm({
    defaultValues: {
      groupName: viewGroup?.groupName || "",
      groupDescription: viewGroup?.groupDescription || "",
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
      key: "employementStatus",
      label: "Employement Status",
    },
    {
      key: "avgRating",
      label: "Avg Rating",
    },
  ];
  return (
    <div className="w-full h-full  flex flex-col p-3">
      <div className="flex justify-between mb-2 items-center">
        <h1 className="font-semibold">Group Details</h1>
        <div className="flex gap-4">
          <Button
            type="submit"
            className="w-fit bg-gradient-to-r bg-teal-900 text-white py-2 rounded-md hover:opacity-90 transition"
            onClick={() =>
              navigate(`${absoluteUrls.admin.home.manage_groups_edit}/${id}`)
            }
          >
            Edit
          </Button>
          <Button variant="solid" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </div>
      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-gray-700 rounded-md gap-2">
        <FormContainer methods={methods} className="flex flex-col gap-2">
          <div className="grid md:flex gap-4">
            <InputField
              name="groupName"
              label="Group Name"
              required
              placeholder="Enter Group Name"
              disabled
            />
            <InputField
              name="groupDescription"
              label="Group Description"
              placeholder="Enter Group Description"
              disabled
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="font-semibold">Engineers</div>
            <SearchInput />
          </div>
          <div className="flex-1 overflow-y-auto ">
            <CustomTable<SelectEngineerProps>
              columns={columns}
              data={SelectEngineer}
              initialPageSize={10}
            />
          </div>
        </FormContainer>
      </div>
      {isModalOpen && (
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
      )}
    </div>
  );
}
