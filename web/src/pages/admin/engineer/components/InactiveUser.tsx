import { manageEngineer } from "@/dummy_data/admin/manageEngineer";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import Popup from "@/shared/components/Popup";
import { useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import type {
  BlockEngineerFormData,
  ManageEngineerProps,
  SuspendEngineerFormData,
} from "../types";
import { usePopupStore } from "@/shared/store/popupStore";
import { toast } from "react-toastify";
import { useClickOutside } from "@/shared/components/UseclickOutside";
import { useForm } from "react-hook-form";
import SuspendEngineer from "./SuspendEngineer";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import BlockEngineer from "./BlockEngineer";
import ActionsMenu from "./ActionMenu";

/**
 * InactiveUser Component
 *
 * Displays a management dashboard for engineers, including:
 * - A search input for filtering results.
 * - A customizable table for viewing detailed engineer data.
 * - Actionable buttons for viewing document details.
 * @returns {JSX.Element} The rendered InactiveUser component.
 */
export default function InactiveUser() {
  const methods = useForm<SuspendEngineerFormData>({
    mode: "onChange",
    defaultValues: {
      suspendStartDate: null,
      suspendEndDate: null,
      reason: "",
    },
  });

  const { showPopup } = usePopupStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [showAction, setShowAction] = useState<number | null>(null);
  const [isSuspendengineer, setIsSuspendengineer] = useState<boolean>(false);
  const [isBlockEngineer, setIsBlockEngineer] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, triggerRef, () => setShowAction(null));

  //Delete confirmation
  const handleDeleteJob = async (job: ManageEngineerProps) => {
    await showPopup({
      title: "Delete Job",
      body: "Are you sure you want to delete this job?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Delete",
          value: "delete",
          variant: "danger",
          action: async (close) => {
            console.log("Deleting job:", job.id);
            toast.success("Job deleted successfully!");
            // TODO: call your delete API here
            // await deleteJob(job.id);
            close(true);
          },
        },
      ],
    });
  };

  const columns: Column<ManageEngineerProps>[] = [
    { key: "id", label: "Sr.No." },
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
      key: "documents",
      label: "View Documents",
      align: "center",
      renderCell: (row: ManageEngineerProps) => {
        const name = row.documents || "N/A";
        return (
          <div className="mx-auto text-center">
            <Button
              className="w-fit bg-gradient-to-r bg-teal-900 text-white"
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
    { key: "lastActiveOn", label: "Last Active On" },
    {
      key: "action",
      label: "Actions",
      align: "center",
      renderCell: (row: ManageEngineerProps) => (
        <ActionsMenu
          row={row}
          showAction={showAction}
          setShowAction={setShowAction}
          handleDelete={handleDeleteJob}
          setIsSuspend={setIsSuspendengineer}
          setIsBlock={setIsBlockEngineer}
        />
      ),
    },
  ];

  const handleSuspendSubmit = async (data: SuspendEngineerFormData) => {
    await showPopup({
      title: "Suspend Engineer",
      body: "Are you sure you want to suspend this engineer?",
      actionButtons: [
        { label: "Cancel", value: null, variant: "outline" },
        {
          label: "Suspend",
          value: "save",
          variant: "danger",
          action: async (close) => {
            console.log("Suspend data:", data);
            close(true);
            methods.reset();
            setIsSuspendengineer(false);
            toast.success("Engineer suspended successfully!");
          },
        },
      ],
    });
  };

  const handleBlockSubmit = async (data: BlockEngineerFormData) => {
    await showPopup({
      title: "Block Engineer",
      body: "Are you sure you want to block this engineer?",
      actionButtons: [
        { label: "Cancel", value: null, variant: "outline" },
        {
          label: "Block",
          value: "save",
          variant: "danger",
          action: async (close) => {
            console.log("Block data:", data);
            close(true);
            methods.reset();
            setIsBlockEngineer(false);
            toast.success("Engineer blocked successfully!");
          },
        },
      ],
    });
  };

  return (
    <div>
      <div className="px-2 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-gray-700 rounded-md gap-2">
        <div className="flex flex-wrap gap-4 items-center">
          <SearchInput />
        </div>
        <div className="h-full flex-1 overflow-y-auto ">
          <CustomTable<ManageEngineerProps>
            columns={columns}
            data={manageEngineer}
            initialPageSize={10}
          />
        </div>
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
      {isSuspendengineer && (
        <FormContainer methods={methods} onSubmit={handleSuspendSubmit}>
          <SuspendEngineer
            isSuspendengineer={isSuspendengineer}
            setIsSuspendengineer={setIsSuspendengineer}
          />
        </FormContainer>
      )}
      {isBlockEngineer && (
        <FormContainer methods={methods} onSubmit={handleBlockSubmit}>
          <BlockEngineer
            isBlockEngineer={isBlockEngineer}
            setIsBlockEngineer={setIsBlockEngineer}
          />
        </FormContainer>
      )}
    </div>
  );
}
