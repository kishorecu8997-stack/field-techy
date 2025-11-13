import { InputField, TextareaInput } from "@/shared/components/commonUI/inputs";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { Dispatch, SetStateAction } from "react";
import { validateAlphabeticTextArea, validateQuestion } from "@/utils/validate";

interface AddFaqProps {
  faqMode: string;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function AddFaq({ faqMode, setIsModalOpen }: AddFaqProps) {
  return (
    <div>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold">
            {faqMode === "Add" ? "Add" : "Edit"} FAQ
          </p>
          <div
            onClick={() => setIsModalOpen(false)}
            className="cursor-pointer text-xl"
          >
            x
          </div>
        </div>

        <div className="grid w-full">
          <InputField
            name="question"
            label="Add your Question"
            type="text"
            required
            rules={{
              required: "Question is required",
              validate: validateQuestion,
            }}
          />

          <TextareaInput
            name="answer"
            label="Add your Answer"
            required
            rules={{
              validate: (v: string) =>
                validateAlphabeticTextArea(v, {
                  minLength: 50,
                  maxLength: 2000,
                  required: true,
                }),
            }}
          />
        </div>

        <div className="flex justify-end mt-2">
          <Button
            type="submit"
            className="w-fit bg-gradient-to-r bg-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
