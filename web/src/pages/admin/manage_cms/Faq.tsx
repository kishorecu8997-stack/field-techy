import { Button } from "@/shared/components/commonUI/Buttons";
import CustomTable, {
  type Column,
} from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import Popup from "@/shared/components/Popup";
import { useState, useMemo } from "react";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "react-toastify";
import type { FaqAddFormData, FaqItem } from "./types";
import { useForm } from "react-hook-form";
import FaqForm from "./FaqForm";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { usePopupStore } from "@/shared/store/popupStore";
import {
  useGetCmsContent,
  useCreateFaq,
  useUpdateFaq,
  useDeleteFaq,
} from "@/shared/apiServices/admin/adminOpenApiService";

/**
 * @component Faq
 * @description This component provides an interface for managing Frequently Asked Questions (FAQs).
 * It includes functionality to display, add, edit, and delete FAQs.
 * A modal popup is used for adding and editing FAQ entries.
 *
 * @returns {JSX.Element} The rendered FAQ management page.
 */
export default function Faq() {
  const methods = useForm<FaqAddFormData>({
    defaultValues: {
      question: "",
      answer: "",
      sortOrder: 0,
    },
  });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [faqMode, setFaqMode] = useState<"Add" | "Edit">("Add");
  const [editingFaqId, setEditingFaqId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { showPopup } = usePopupStore();

  const { data: cmsData, isLoading, error } = useGetCmsContent("faq");

  const createMutation = useCreateFaq({
    onSuccess: (data) => {
      toast.success(data.message || "FAQ added successfully!");
      setIsModalOpen(false);
      methods.reset();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to add FAQ");
      console.error("Error creating FAQ:", error);
    },
  });

  const updateMutation = useUpdateFaq({
    onSuccess: (data) => {
      toast.success(data.message || "FAQ updated successfully!");
      setIsModalOpen(false);
      setEditingFaqId(null);
      methods.reset();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update FAQ");
      console.error("Error updating FAQ:", error);
    },
  });

  const deleteMutation = useDeleteFaq({
    onSuccess: (data) => {
      toast.success(data.message || "FAQ deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete FAQ");
      console.error("Error deleting FAQ:", error);
    },
  });

  const faqList: FaqItem[] = useMemo(() => {
    if (!cmsData || !("type" in cmsData) || cmsData.type !== "faq") {
      return [];
    }
    return cmsData.data.map((faq) => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      sortOrder: faq.sortOrder,
    }));
  }, [cmsData]);

  // Filter FAQs based on search query
  const filteredFaqList = useMemo(() => {
    if (!searchQuery.trim()) return faqList;

    const query = searchQuery.toLowerCase();
    return faqList.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query),
    );
  }, [faqList, searchQuery]);

  // Delete confirmation
  const handleDeleteFaq = async (faq: FaqItem) => {
    await showPopup({
      title: "Delete FAQ",
      body: "Are you sure you want to delete this FAQ?",
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
          action: async (close: any) => {
            try {
              await deleteMutation.mutateAsync({
                path: { id: faq.id },
              });
              close(true);
            } catch (error) {
              console.error("Failed to delete FAQ:", error);
            }
          },
        },
      ],
    });
  };

  const columns: Column<FaqItem>[] = [
    {
      key: "sortOrder",
      label: "Order",
      renderCell: (row: FaqItem) => <span>{row.sortOrder}</span>,
    },
    { key: "question", label: "Question" },
    {
      key: "answer",
      label: "Answer",
      renderCell: (row: FaqItem) => (
        <div className="max-w-md truncate" title={row.answer}>
          {row.answer}
        </div>
      ),
    },
    {
      key: "action",
      label: "Action",
      align: "center",
      renderCell: (row: FaqItem) => (
        <div className="flex items-center gap-2 justify-center">
          <div
            className="p-2 bg-blue-100 rounded-md cursor-pointer hover:bg-blue-200 transition"
            onClick={() => {
              setFaqMode("Edit");
              setEditingFaqId(row.id);
              setIsModalOpen(true);
              methods.reset({
                question: row.question,
                answer: row.answer,
                sortOrder: row.sortOrder,
              });
            }}
          >
            <CiEdit className="text-blue-600" />
          </div>
          <div
            className="p-2 bg-red-100 rounded-md cursor-pointer hover:bg-red-200 transition"
            onClick={() => handleDeleteFaq(row)}
          >
            <RiDeleteBin6Line className="text-red-600" />
          </div>
        </div>
      ),
    },
  ];

  const handleSaveConfirmation = async (data: FaqAddFormData) => {
    await showPopup({
      title: `${faqMode === "Add" ? "Add" : "Edit"} FAQ`,
      body: "Are you sure you want to save these details?",
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
          action: async (close: any) => {
            try {
              if (faqMode === "Add") {
                await createMutation.mutateAsync({
                  body: {
                    question: data.question,
                    answer: data.answer,
                    sortOrder: data.sortOrder || 0,
                  },
                });
              } else if (editingFaqId) {
                await updateMutation.mutateAsync({
                  path: { id: editingFaqId },
                  body: {
                    question: data.question,
                    answer: data.answer,
                    sortOrder: data.sortOrder || 0,
                  },
                });
              }
              close(true);
            } catch (error) {
              console.error("Failed to save FAQ:", error);
            }
          },
        },
      ],
    });
  };

  const handleSubmit = (data: FaqAddFormData) => {
    console.log("FAQ Form Submitted", data);
    handleSaveConfirmation(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Loading FAQs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">Failed to load FAQs</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <Button
          type="submit"
          onClick={() => {
            setIsModalOpen(true);
            setFaqMode("Add");
            setEditingFaqId(null);
            methods.reset({
              question: "",
              answer: "",
              sortOrder: faqList.length,
            });
          }}
          className="w-fit mt-2 bg-gradient-to-r bg-teal-900 text-white rounded-lg hover:opacity-90 transition"
        >
          Add FAQ
        </Button>
      </div>
      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-neutral-800 rounded-md gap-2">
        <div>
          <SearchInput
            value={searchQuery}
            onChange={(value) => setSearchQuery(value)}
          />
        </div>
        <div className="h-full flex-1 overflow-y-auto">
          <CustomTable<FaqItem>
            columns={columns}
            data={filteredFaqList}
            initialPageSize={10}
          />
        </div>
      </div>
    
      {isModalOpen && (
        <Popup
          onClose={() => {
            setIsModalOpen(false);
            setEditingFaqId(null);
            methods.reset();
          }}
          open={isModalOpen}
        >
          <FormContainer
            methods={methods}
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 mt-6 px-2 pb-4 w-full"
          >
            <FaqForm
              faqMode={faqMode}
              setIsModalOpen={setIsModalOpen}
              isLoading={createMutation.isPending || updateMutation.isPending}
            />
          </FormContainer>
        </Popup>
      )}
    </div>
  );
}
