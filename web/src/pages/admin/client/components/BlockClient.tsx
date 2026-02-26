import { Button } from "@/shared/components/commonUI/Buttons";
import { TextareaInput } from "@/shared/components/commonUI/inputs";
import Popup from "@/shared/components/Popup";
import { IoCloseSharp } from "react-icons/io5";
import { useFormContext, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type { BlockClientForm, BlockClientProps } from "../types";
import { useAdminClientsByUserIdStatus } from "@/shared/apiServices/admin/adminOpenApiService";

/**
 * BlockClient Component
 * @param userId - ID of the user to be blocked
 * @param isBlockClient - Boolean to control the visibility of the popup
 * @param setIsBlockClient - Function to update the visibility of the popup
 * @param onSuccess - Callback function to be executed after successful submission
 */
export default function BlockClient({
  userId,
  isBlockClient,
  setIsBlockClient,
  onSuccess,
}: BlockClientProps) {
  const { handleSubmit, reset } = useFormContext<BlockClientForm>();
  const { mutate: updateStatus, isPending } = useAdminClientsByUserIdStatus({
    onSuccess: () => {
      toast.success("Client has been blocked successfully!");
      setIsBlockClient(false);
      reset();
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      const errorMessage =
        (error as { body?: { error?: string } })?.body?.error ||
        "Failed to block client. Please try again.";
      toast.error(errorMessage);
    },
  });

  const onSubmit: SubmitHandler<BlockClientForm> = (data) => {
    if (userId === undefined || userId === null) {
      toast.error("User ID is missing.");
      return;
    }

    updateStatus({
      path: { userId },
      body: {
        userStatus: "blocked",
        reason: data.reason,
      },
    });
  };

  return (
    <Popup open={isBlockClient} onClose={() => setIsBlockClient(false)}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-lg dark:text-white">
            Block Client
          </span>
          <div
            className="text-xl font-semibold cursor-pointer"
            onClick={() => setIsBlockClient(false)}
          >
            <IoCloseSharp className="dark:text-white" />
          </div>
        </div>

        <div className="my-4">
          <TextareaInput
            name="reason"
            label="Reason for Block"
            placeholder="Enter reason for blocking the client"
            required
          />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setIsBlockClient(false)}
            className="border-gray-300"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-fit bg-gradient-to-r from-teal-800 to-teal-900 text-white px-6"
            onClick={handleSubmit(onSubmit)}
            loading={isPending}
            disabled={isPending}
          >
            Submit
          </Button>
        </div>
      </div>
    </Popup>
  );
}
