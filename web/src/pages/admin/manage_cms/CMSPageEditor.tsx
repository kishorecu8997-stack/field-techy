import { Button } from "@/shared/components/commonUI/Buttons";
import QuillEditor from "@/shared/components/QuillEditor";
import { usePopupStore } from "@/shared/store/popupStore";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  useCreateOrUpdateCMSPage,
  useGetCmsPages,
} from "@/shared/apiServices/admin/adminOpenApiService";
import type { CreateOrUpdatePageData } from "@/api/types.gen";
import { useQueryClient } from "@tanstack/react-query";

interface CMSPageEditorProps {
  slug: NonNullable<CreateOrUpdatePageData["body"]>["slug"];
  initialContent?: string;
  initialTitle?: string;
  pageLabel: string;
}

export default function CMSPageEditor({
  slug,
  initialContent = "",
  initialTitle = "",
  pageLabel,
}: CMSPageEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [title, setTitle] = useState(initialTitle || pageLabel);
  const [isLoading, setIsLoading] = useState(true);

  const { showPopup } = usePopupStore();
  const queryClient = useQueryClient();

  const {
    data: cmsPages,
    isLoading: isFetchingPages,
    refetch,
  } = useGetCmsPages({
    onError: (error: any) => {
      console.error("Error fetching CMS pages:", error);
      toast.error("Failed to load existing content");
    },
  });

  useEffect(() => {
    if (cmsPages && !isFetchingPages) {
      const existingPage = cmsPages.find((page) => page.slug === slug);
      if (existingPage) {
        setTitle(existingPage.title);
        setContent(existingPage.content);
      }
      setIsLoading(false);
    }
  }, [cmsPages, isFetchingPages, slug]);

  const mutation = useCreateOrUpdateCMSPage({
    onSuccess: async (data) => {
      toast.success(data.message || `${pageLabel} updated successfully!`);

      await refetch();

      queryClient.invalidateQueries({
        queryKey: ["cms-content", slug],
      });

      queryClient.invalidateQueries({
        queryKey: ["cms-content"],
      });

      console.log(`Cache invalidated for slug: ${slug}`);
    },
    onError: (error: any) => {
      toast.error(
        error?.message || `Failed to update ${pageLabel.toLowerCase()}`,
      );
      console.error(`Error updating ${pageLabel}:`, error);
    },
  });

  const onChange = (html: string) => {
    setContent(html);
  };

  const handleSaveConfirmation = async () => {
    await showPopup({
      title: pageLabel,
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
              await mutation.mutateAsync({
                body: {
                  slug,
                  title,
                  content,
                },
              });
              close(true);
            } catch (error) {
              console.error(`Error saving ${pageLabel}:`, error);
            }
          },
        },
      ],
    });
  };

  if (isLoading || isFetchingPages) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* Title Input */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="page-title"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Title
        </label>
        <input
          id="page-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter page title..."
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-teal-500 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
      </div>

      {/* Content Editor */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="page-content"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Content
        </label>
        <QuillEditor
          value={content}
          onChange={onChange}
          placeholder={"Start writing..."}
        />
      </div>

      {/* Save Button */}
      <div className="w-full flex justify-end">
        <Button
          className="w-fit mt-2 bg-gradient-to-r bg-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          onClick={handleSaveConfirmation}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
