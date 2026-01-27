import { absoluteUrls } from "@/config/urls";
import { JobStatus, manageEngineer } from "@/dummy_data/admin/manageEngineer";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import Popup from "@/shared/components/Popup";
import SelectMenu from "@/shared/components/SelectMenu";
import { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { IoCloseSharp } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import type { ManageEngineerProps } from "../types";
import { usePopupStore } from "@/shared/store/popupStore";
import type { adminJobsStatus } from "../../jobs/types";
import { toast } from "react-toastify";

/**
 * PendingRequest Component
 *
 * Displays a management dashboard for engineers, including:
 * - A search input for filtering results.
 * - A customizable table for viewing detailed engineer data.
 * - Actionable buttons for viewing document details.
 *
 * @component
 * @example
 * return (
 *   <PendingRequest />
 * );
 *
 * @returns {JSX.Element} The rendered PendingRequest component.
 */
export default function PendingRequest() {
  const navigate = useNavigate();
  const { showPopup } = usePopupStore();
  const [rowStatuses, setRowStatuses] = useState<Record<number, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filteredData = manageEngineer
      .filter((e) => e.kycStatus === "Pending")
      .filter((e) => {
        const query = search.toLowerCase();

        return (
          e.engineerID.toLowerCase().includes(query) ||
          e.details.name.toLowerCase().includes(query) ||
          e.details.email.toLowerCase().includes(query) ||
          e.location.toLowerCase().includes(query)
        );
      });

  const handleStatusChange = async (data: ManageEngineerProps) => {
    if (!data.status) return;

    const status = data.status.toLowerCase();
    let toastMessage = "";

    switch (status) {
      case "approve":
        toastMessage = "Engineer approved successfully!";
        break;
      case "reject":
        toastMessage = "Engineer rejected successfully!";
        break;
      case "pending":
        toastMessage = "Engineer marked as pending successfully!";
        break;
      default:
        toastMessage = `Engineer status updated to ${data.status}`;
        break;
    }
      let bodyMessage = "";

    if (data.status.toLowerCase() === "pending") {
      bodyMessage = "Are you sure you want to set this engineer to pending?";
    } else {
      const formattedStatus = data.status.charAt(0).toUpperCase() + data.status.slice(1).toLowerCase();
      bodyMessage = `Are you sure you want to ${formattedStatus} this engineer?`;
    }

    await showPopup({
      title: `${data.status.charAt(0).toUpperCase() + data.status.slice(1)} Engineer`,
      body: bodyMessage,
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Yes",
          value: "yes",
          variant:
            status === "approve"
              ? "primary"
              : status === "reject"
                ? "danger"
                : status === "pending"
                  ? "warning"
                  : "secondary",
          action: async (close) => {
            if (status === "reject") {
            toast.error(toastMessage); 
          } else if (status === "approve") {
            toast.success(toastMessage);
          } else {
            toast.warning(toastMessage)
          }
            close(true);
          },
        },
      ],
    });
  };

  //Delete confirmation
  const handleDeleteEngineer = async (job: ManageEngineerProps) => {
    await showPopup({
      title: "Delete Engineer",
      body: "Are you sure you want to delete this engineer?",
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
            console.log("Deleting engineer:", job.id);
            toast.success("Engineer deleted successfully!");
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
      key: "submittedDocuments",
      label: "Submitted Documents",
      renderCell: (row: ManageEngineerProps) => {
        const documents = row.submittedDocuments;
        return (
          <div className="text-sm flex flex-col gap-1">
            {documents.map((doc, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs dark:bg-gray-700 dark:text-gray-200"
              >
                {doc}
              </span>
            ))}
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
      dataCellAlign: "center",
    },
    {
      key: "walletBalance",
      label: "Wallet Balance",
      dataCellAlign: "center",
    },
    {
      key: "kycStatus",
      label: "KYC Status",
      dataCellAlign: "center",
    },
    {
      key: "employmentStatus",
      label: "Employment Status",
      dataCellAlign: "center",
    },
    {
      key: "avgRating",
      label: "Avg Rating",
      dataCellAlign: "center",
    },
    {
      key: "approvalStatus",
      label: "Approve/Reject",
      renderCell: (row: ManageEngineerProps) => {
        const current = rowStatuses[row.id] ?? "pending";
        const preparedOptions = [
          ...JobStatus.filter((opt) => opt.value === current).map((opt) => ({
            ...opt,
            disabled: true,
          })),
          ...JobStatus.filter((opt) => opt.value !== current),
        ];
        
        return (
          <div className="relative w-full">
            <SelectMenu
              placeholder="Select"
              value={current}
              onChange={(value: string | null) => {
                if (!value || value === current) return;

                setRowStatuses((prev) => ({
                  ...prev,
                  [row.id]: value,
                }));

                handleStatusChange({
                  ...row,
                  status: value as adminJobsStatus,
                });
              }}
              options={preparedOptions}
              badge
            />
          </div>
        );
      },
    },
    {
      key: "action",
      label: "Actions",
      align: "center",
      renderCell: (row: ManageEngineerProps) => (
        <div className="flex items-center gap-2">
          <div
            className="p-2 bg-yellow-100 rounded-md cursor-pointer"
            onClick={() =>
              navigate(absoluteUrls.admin.home.manage_engineer_view)
            }
          >
            <FiEye className="text-yellow-600" />
          </div>
          <div
            className="p-2 bg-blue-100 rounded-md cursor-pointer"
            onClick={() =>
              navigate(
                `${absoluteUrls.admin.home.manage_engineer_edit}/${row.id}`,
              )
            }
          >
            <CiEdit className="text-blue-600" />
          </div>
          <div
            className="p-2 bg-red-100 rounded-md cursor-pointer"
            onClick={() => handleDeleteEngineer(row)}
          >
            <RiDeleteBin6Line className="text-red-600" />
          </div>
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
            initialPageSize={10}
          />
        </div>
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
