import {
  SelectEngineer,
  type SelectEngineerProps,
} from "@/dummy_data/admin/manageGroups";
import { Button } from "@/shared/components/commonUI/Buttons";
import {
  CustomTable,
  type Column,
} from "@/shared/components/commonUI/custom_table";
import { usePopupStore } from "@/shared/store/popupStore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { absoluteUrls } from "@/config/urls";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import Popup from "@/shared/components/Popup";
import { IoCloseSharp } from "react-icons/io5";

/**
 * SelectEngineers
 *
 * Page component for selecting engineers to add to an existing group.
 * Displays a searchable, multi-select table of available engineers with
 * bulk selection support (select-all checkbox) and document viewing capability.
 *
 * Features:
 * - Multi-select checkbox table with select-all header checkbox
 * - Searchable engineer list showing name, contact, and KYC details
 * - View documents modal for each engineer
 * - Add to Group confirmation popup before submission
 * - Submit button disabled until at least one engineer is selected
 * - Navigation back to manage groups on success
 *
 * State management:
 * - Uses `react-hook-form` for form integration
 * - Local state for modal visibility, selected engineer IDs, and selected row
 * - Uses `usePopupStore` for confirmation dialogs and `useNavigate` for routing
 *
 * @component
 * @returns {JSX.Element} Engineer selection table with multi-select and modals
 */
export default function SelectEngineers() {
  const methods = useForm({ defaultValues: { selectedIds: [] } });
  const { showPopup } = usePopupStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  const columns: Column<SelectEngineerProps>[] = [
    {
      key: "select",
      label: (
        <input
          type="checkbox"
          checked={selectedIds.length === SelectEngineer.length}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds(SelectEngineer.map((item) => item.engineerID));
            } else {
              setSelectedIds([]);
            }
          }}
        />
      ),
      renderCell: (row: SelectEngineerProps) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.engineerID)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds((prev) => [...prev, row.engineerID]);
            } else {
              setSelectedIds((prev) =>
                prev.filter((id) => id !== row.engineerID)
              );
            }
          }}
        />
      ),
    },
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

  const handleSubmit = async (selectedIds: string[]) => {
    showPopup({
      title: "Add to Group",
      body: "Are you sure you want to add these engineers to the group?",
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
            console.log("Submitted data:", selectedIds);
            toast.success("Group added successfully");
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
      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-gray-700 rounded-md gap-2">
        <FormContainer
          methods={methods as any}
          className="flex flex-col gap-2"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-between items-center">
            <div className="font-semibold">Select Engineers</div>
            <div className="flex gap-2 items-center">
              <SearchInput />
              <Button variant="solid" onClick={() => navigate(-1)}>
                Back
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
              disabled={selectedIds.length === 0}
            >
              Add to Group
            </Button>
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
