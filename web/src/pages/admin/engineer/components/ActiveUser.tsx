import { Button } from "@/shared/components/commonUI/Buttons";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import Popup from "@/shared/components/Popup";
import { useMemo, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import {
  SUSPEND_ENGINEER_DEFAULT_VALUES,
  type BlockEngineerFormData,
  type ManageEngineerProps,
  type SuspendEngineerFormData,
  type EngineerStatusType
} from "../types";
import { usePopupStore } from "@/shared/store/popupStore";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import SuspendEngineer from "./SuspendEngineer";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import BlockEngineer from "./BlockEngineer";
import ActionsMenu from "./ActionMenu";
import { useAdminManageEngineers } from "@/shared/apiServices/admin/adminOpenApiService";
/**
 * ActiveUser Component
 *
 * Displays a management dashboard for engineers, including:
 * - A search input for filtering results.
 * - A customizable table for viewing detailed engineer data.
 * - Actionable buttons for viewing document details.
 * @returns {JSX.Element} The rendered ActiveUser component.
 */
export default function ActiveUser() {
  const methods = useForm<SuspendEngineerFormData>({
    mode: "onChange",
    defaultValues: SUSPEND_ENGINEER_DEFAULT_VALUES,
  });

  const { showPopup } = usePopupStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [showAction, setShowAction] = useState<number | null>(null);
  const [isSuspendEngineer, setIsSuspendEngineer] = useState<boolean>(false);
  const [isBlockEngineer, setIsBlockEngineer] = useState<boolean>(false);
  const [search, setSearch] = useState("");

    const {
      data: engineersResponse,
      isLoading,
    } = useAdminManageEngineers({
      page: 1,
      limit: 10,
      status: "active",
    });
    
    // Map API response to table rows
    const engineersData: ManageEngineerProps[] = (engineersResponse?.data ?? []).map((e) => ({
      id: e.userId,
      userId: e.userId,
      engineerID: e.engineerCode,
      details: {
        name: e.name || "N/A",
        email: e.email || "N/A",
        phone: e.phoneNumber || "N/A",
      },
      submittedDocuments: e.statusHistory?.map((s) => s.type) ?? [],
      documents: "View",
      location: e.location || "N/A",
      registrationDate: new Date(e.registrationDate).toLocaleDateString(),
      walletBalance: e.balance?.toString() ?? "0",
      kycStatus: e.profileStatus as EngineerStatusType,
      employmentStatus: e.isEmployed ? "Employed" : "Unemployed",
      avgRating: e.averageRating,
      approvalStatus: e.profileStatus as EngineerStatusType,
    }));
  
    const filteredData = useMemo(() => {
      const q = search.toLowerCase();
      return engineersData.filter(
        (e) =>
          e.engineerID.toLowerCase().includes(q) ||
          e.details.name.toLowerCase().includes(q) ||
          e.details.email.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q)
      );
    }, [engineersData, search]);

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
      key: "action",
      label: "Actions",
      align: "center",
      dataCellAlign: "center",
      renderCell: (row: ManageEngineerProps) => (
        <ActionsMenu
          row={row}
          showAction={showAction}
          setShowAction={setShowAction}
          handleDelete={handleDeleteEngineer}
          setIsSuspend={setIsSuspendEngineer}
          setIsBlock={setIsBlockEngineer}
        />
      ),
    },
  ];

  const onSubmit = async (
    data: SuspendEngineerFormData | BlockEngineerFormData,
  ) => {
    if (isSuspendEngineer) {
      await handleSuspendSubmit(data as SuspendEngineerFormData);
    } else {
      await handleBlockSubmit(data);
    }
  };

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
            methods.reset();
            setIsSuspendEngineer(false);
            toast.success("Engineer suspended successfully!");
            close(true);
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
          <SearchInput value={search} onChange={setSearch} />
        </div>
        <div className="h-full flex-1 overflow-y-auto ">
          <CustomTable<ManageEngineerProps>
            columns={columns}
            data={filteredData}
            initialPageSize={10}
            loading={isLoading}
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
      <FormContainer methods={methods} onSubmit={onSubmit}>
        {isSuspendEngineer && (
          <SuspendEngineer
            isSuspendEngineer={isSuspendEngineer}
            setIsSuspendEngineer={setIsSuspendEngineer}
          />
        )}
        {isBlockEngineer && (
          <BlockEngineer
            isBlockEngineer={isBlockEngineer}
            setIsBlockEngineer={setIsBlockEngineer}
          />
        )}
      </FormContainer>
    </div>
  );
}
