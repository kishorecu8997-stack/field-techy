import { faqList } from "@/dummy_data/admin/Faq";
import { Button } from "@/shared/components/commonUI/Buttons";
import CustomTable, {
  type Column,
} from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import Popup from "@/shared/components/Popup";
import { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "react-toastify";
import type { FaqAddFormData, FaqItem } from "./types";
import { useForm } from "react-hook-form";
import FaqForm from "./FaqForm";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { usePopupStore } from "@/shared/store/popupStore";

/**
 * @component Faq
 * @description This component provides an interface for managing Frequently Asked Questions (FAQs).
 * It includes functionality to display, add, edit, and delete FAQs.
 * A modal popup is used for adding and editing FAQ entries.
 *
 * @returns {JSX.Element} The rendered FAQ management page.
 *
 * @example
 * return <Faq />;
 */
export default function Faq() {
  const methods = useForm<FaqAddFormData>({
    defaultValues: {
      question: "",
      answer: "",
    },
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [faqMode, setFaqMode] = useState<"Add" | "Edit">("Add");
  const { showPopup } = usePopupStore();

  //Delete confirmation
  const handleDeleteJob = async (job: FaqItem) => {
    await showPopup({
      title: "Delete Faq",
      body: "Are you sure you want to delete this faq?",
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          action: async (close: any) => {
            console.log("Deleting job:", job.id);
            // TODO: call your delete API here
            // await deleteJob(job.id);
            close(true);
          },
        },
      ],
    });
  };

  const columns: Column<FaqItem>[] = [
    { key: "id", label: "Sr.No." },
    { key: "question", label: "Question" },
    { key: "answer", label: "Answer" },
    {
      key: "action",
      label: "Action",
      align: "center",
      renderCell: (row: FaqItem) => (
        <div className="flex items-center gap-2">
          <div
            className="p-2 bg-blue-100 rounded-md cursor-pointer"
            onClick={() => {
              setFaqMode("Edit");
              setIsModalOpen(true);
              methods.reset({
                question: row.question,
                answer: row.answer,
              });
            }}
          >
            <CiEdit className="text-blue-600" />
          </div>
          <div
            className="p-2 bg-red-100 rounded-md cursor-pointer"
            onClick={() => handleDeleteJob(row)}
          >
            <RiDeleteBin6Line className="text-red-600" />
          </div>
        </div>
      ),
    },
  ];

  const handleSaveConfirmation = async (data: FaqAddFormData) => {
    console.log("data :", data);
    await showPopup({
      title: `${faqMode === "Add" ? "Add" : "Edit"} Faq`,
      body: "Are you sure you want to save this details?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Save",
          value: "save",
          variant: "primary",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          action: async (close: any) => {
            console.log("Deleting job:", close);
            // TODO: call your delete API here
            // await deleteJob(job.id);
            toast.success(
              `${faqMode === "Add" ? "Added" : "Edited"} Successfully!`,
            );
            close(true);
            setIsModalOpen(false);
          },
        },
      ],
    });
  };

  const handleSubmit = (data: FaqAddFormData) => {
    console.log("Faq Form Submitted", data);
    handleSaveConfirmation(data);
  };

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <Button
          type="submit"
          onClick={() => {
            setIsModalOpen(true);
            setFaqMode("Add");
            methods.reset({
              question: "",
              answer: "",
            });
          }}
          className="w-fit mt-2 bg-gradient-to-r bg-teal-900 text-white rounded-lg hover:opacity-90 transition"
        >
          Add Faq
        </Button>
      </div>
      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-neutral-800 rounded-md gap-2">
        <div>
          <SearchInput />
        </div>
        <div className="h-full flex-1 overflow-y-auto ">
          <CustomTable<FaqItem>
            columns={columns}
            data={faqList}
            initialPageSize={10}
          />
        </div>
      </div>
      {isModalOpen && (
        <Popup onClose={() => setIsModalOpen(false)} open={isModalOpen}>
          <FormContainer
            methods={methods}
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 mt-6 px-2 pb-4 w-full"
          >
            <FaqForm faqMode={faqMode} setIsModalOpen={setIsModalOpen} />
          </FormContainer>
        </Popup>
      )}
    </div>
  );
}
