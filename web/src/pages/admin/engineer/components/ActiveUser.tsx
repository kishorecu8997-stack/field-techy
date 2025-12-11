import { absoluteUrls } from "@/config/urls";
import { manageEngineer } from "@/dummy_data/admin/manageEngineer";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import Popup from "@/shared/components/Popup";
import { useRef, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { IoCloseSharp } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import type { ManageEngineerProps, SuspendEngineerFormData } from "../types";
import { usePopupStore } from "@/shared/store/popupStore";
import { toast } from "react-toastify";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useClickOutside } from "@/shared/components/UseclickOutside";
import { MdBlockFlipped, MdPauseCircleOutline } from "react-icons/md";
import { useForm } from "react-hook-form";
import SuspendEngineer from "./SuspendEngineer";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";

/**
 * ActiveUser Component
 *
 * Displays a management dashboard for engineers, including:
 * - A search input for filtering results.
 * - A customizable table for viewing detailed engineer data.
 * - Actionable buttons for viewing document details.
 *
 * @component
 * @example
 * return (
 *   <ActiveUser />
 * );
 *
 * @returns {JSX.Element} The rendered ActiveUser component.
 */
export default function ActiveUser() {
  const methods = useForm<SuspendEngineerFormData>({
    mode: "onChange",
    defaultValues: {
      suspendStartDate: null,
      suspendEndDate: null,
      reason: "",
    },
  });

  const navigate = useNavigate();
  const { showPopup } = usePopupStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [showAction, setShowAction] = useState<number | null>(null);
  const [isSuspendengineer, setIsSuspendengineer] = useState<boolean>(false);
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
    {
      key: "action",
      label: "Actions",
      align: "center",
      renderCell: (row: ManageEngineerProps) => (
        <div className="relative inline-block">
          <div
            ref={showAction === row.id ? triggerRef : null}
            onClick={(e) => {
              e.stopPropagation();
              setShowAction(showAction === row.id ? null : row.id);
            }}
            className="text-center text-lg cursor-pointer"
          >
            <HiOutlineDotsHorizontal />
          </div>

          {showAction === row.id && (
            <div className="absolute right-0 mt-1 bg-white dark:bg-gray-700 rounded-lg shadow-lg z-10 w-fit py-2">
              <div
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                onClick={() => {
                  setShowAction(null);
                  navigate(absoluteUrls.admin.home.manage_engineer_view);
                }}
              >
                <FiEye className="text-yellow-600" />
                <span>View</span>
              </div>

              <div
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                onClick={() => {
                  setShowAction(null);
                  navigate(
                    `${absoluteUrls.admin.home.manage_engineer_edit}/${row.id}`
                  );
                }}
              >
                <CiEdit className="text-blue-600" />
                <span>Edit</span>
              </div>
              <div
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                onClick={() => setIsSuspendengineer(true)}
              >
                <MdPauseCircleOutline className="text-gray-300" />
                Suspend
              </div>
              <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
                <MdBlockFlipped className="text-gray-300" />
                Block
              </div>

              <div
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                onClick={() => {
                  setShowAction(null);
                  handleDeleteJob(row);
                }}
              >
                <RiDeleteBin6Line className="text-red-600" />
                <span>Delete</span>
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];

  const handleSubmit = async (data: SuspendEngineerFormData) => {
    await showPopup({
      title: "Suspend Engineer",
      body: "Are you sure you want to suspend this engineer?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Suspend",
          value: "save",
          variant: "danger",
          action: async (close) => {
            console.log("data :", data);
            close(true);
            methods.reset();
            setIsSuspendengineer(false);
            toast.success("Engineer suspended successfully!");
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
        <FormContainer methods={methods} onSubmit={handleSubmit}>
          <SuspendEngineer
            isSuspendengineer={isSuspendengineer}
            setIsSuspendengineer={setIsSuspendengineer}
          />
        </FormContainer>
      )}
    </div>
  );
}
