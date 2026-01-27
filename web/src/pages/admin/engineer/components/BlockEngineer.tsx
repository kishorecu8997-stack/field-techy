import { Button } from "@/shared/components/commonUI/Buttons";
import { TextareaInput } from "@/shared/components/commonUI/inputs";
import Popup from "@/shared/components/Popup";
import { validateDescription } from "@/utils/validate";
import { IoCloseSharp } from "react-icons/io5";
import { useFormContext, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";

type BlockEngineerForm = {
  reason: string
}

export default function BlockEngineer({
  isBlockEngineer,
  setIsBlockEngineer,
}: {
  isBlockEngineer: boolean;
  setIsBlockEngineer: React.Dispatch<React.SetStateAction<boolean>>;
}) {

    const { handleSubmit } = useFormContext<BlockEngineerForm>();
      // This function only executes if validation passes
      const onSubmit: SubmitHandler<BlockEngineerForm> = (data) => {
        console.log("Form Data:", data);
        // Add your API call logic here
        toast.success("Engineer blocked successfully!");
        setIsBlockEngineer(false);
      };

  return (
    <div>
      <Popup open={isBlockEngineer} onClose={() => setIsBlockEngineer(false)}>
        <div className="p-4">
          <div className="flex justify-between items-center">
            <span className="font-bold">Block Engineer</span>
            <div
              className="text-xl font-semibold cursor-pointer"
              onClick={() => setIsBlockEngineer(false)}
            >
              <IoCloseSharp />
            </div>
          </div>

          <div className="my-4">
            <TextareaInput
              name="reason"
              label="Reason for Block"
              placeholder="Reason"
              required
              rules={{ validate: (v: string) => validateDescription(v) }}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsBlockEngineer(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-fit bg-gradient-to-r bg-teal-900 text-white"
              onClick={handleSubmit(onSubmit)}
            >
              Submit
            </Button>
          </div>
        </div>
      </Popup>
    </div>
  );
}
