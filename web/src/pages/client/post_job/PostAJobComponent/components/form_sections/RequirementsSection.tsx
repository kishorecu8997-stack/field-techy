import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/shared/components/commonUI/Buttons";
import {
  FileUpload,
  InputField,
  SelectField,
} from "@/shared/components/commonUI/inputs";
import TagSelectField from "@/shared/components/commonUI/inputs/TagSelectField";
import SectionHeader from "../../SectionHeader";

interface ToolEntry {
  id: string; // Tool ID
  name: string;
  budget: string;
  images: { name: string; url: string; file: File }[];
}

interface RequirementsSectionProps {
  isDisable: boolean;
  skillOptions: { label: string; value: string }[];
  toolOptions: { label: string; value: string }[];
}

/**
 * Requirements Section Component
 * This component renders the requirements section of the job posting form.
 * @param {RequirementsSectionProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered RequirementsSection component.
 */
const RequirementsSection = ({
  isDisable,
  skillOptions,
  toolOptions,
}: RequirementsSectionProps) => {
  const {
    watch,
    register,
    setValue,
    setError,
    clearErrors,
  } = useFormContext();

  const [toolEntries, setToolEntries] = useState<ToolEntry[]>([]);
  const [toolImageInputKey, setToolImageInputKey] = useState(0);
  const [editingToolIndex, setEditingToolIndex] = useState<number | null>(null);

  useEffect(() => {
    register("toolEntriesCount", {
      validate: (val) => {
        if (Number(val) > 0) return true;
        return "Add at least one tool entry before submitting";
      },
    });
  }, [register]);

  useEffect(() => {
    setValue("toolEntriesCount", toolEntries.length, { shouldValidate: true });
    setValue("toolsData", toolEntries);
  }, [setValue, toolEntries]);

  const handleAddToolEntry = () => {
    const toolId = (watch("tools") as string | undefined)?.trim();
    const budget = (watch("toolBudgetNotes") as string | undefined)
      ?.replace(/\D+/g, "")
      ?.trim();
    const files = watch("toolImages") as FileList | undefined;

    let hasError = false;

    if (!toolId) {
      setError("tools", { type: "manual", message: "Tool Name is required" });
      hasError = true;
    }
    if (!files || files.length === 0) {
      setError("toolImages", { type: "manual", message: "Tool Image is required" });
      hasError = true;
    }
    if (!budget || Number(budget) <= 0) {
      setError("toolBudgetNotes", { type: "manual", message: "Tool Cost is required" });
      hasError = true;
    } else if (Number(budget) > 10_000_000) {
      setError("toolBudgetNotes", { type: "manual", message: "Max allowed amount is 10,000,000" });
      hasError = true;
    }

    if (hasError) return;

    const toolOption = toolOptions.find((opt) => opt.value === toolId);
    const name = toolOption?.label || "Unknown Tool";

    // Clear errors if validation passes
    clearErrors(["tools", "toolBudgetNotes", "toolImages"]);

    const newImages =
      files && files.length > 0
        ? Array.from(files).map((file) => ({
          name: file.name,
          url: URL.createObjectURL(file),
          file: file,
        }))
        : undefined;

    if (editingToolIndex !== null) {
      setToolEntries((prev) => {
        const next = [...prev];
        const existingImages = prev[editingToolIndex]?.images || [];
        next[editingToolIndex] = {
          id: toolId || "",
          name,
          budget: budget || "-",
          images: newImages ?? existingImages,
        };
        return next;
      });
      setEditingToolIndex(null);
    } else {
      setToolEntries((prev) => [
        ...prev,
        { id: toolId || "", name, budget: budget || "-", images: newImages ?? [] },
      ]);
    }

    setValue("tools", "");
    setValue("toolBudgetNotes", "");
    setValue("toolImages", undefined);
    setToolImageInputKey((key) => key + 1);
    clearErrors(["tools", "toolBudgetNotes", "toolImages"]);
  };

  const handleRemoveToolEntry = (index: number) => {
    setToolEntries((prev) => prev.filter((_, idx) => idx !== index));
    if (editingToolIndex === index) {
      setEditingToolIndex(null);
      setValue("tools", "");
      setValue("toolBudgetNotes", "");
      setValue("toolImages", undefined);
      setToolImageInputKey((key) => key + 1);
    }
  };

  const handleEditToolEntry = (index: number) => {
    const entry = toolEntries[index];
    setEditingToolIndex(index);
    setValue("tools", entry.id); // Set ID for select field
    setValue("toolBudgetNotes", entry.budget === "-" ? "" : entry.budget);
    setValue("toolImages", undefined);
    setToolImageInputKey((key) => key + 1);
  };

  // Sync tool budget total to form whenever toolEntries change
  useEffect(() => {
    const total = toolEntries.reduce((sum, entry) => {
      const num = Number(entry.budget.replace(/\D/g, ""));
      return sum + (Number.isNaN(num) ? 0 : num);
    }, 0);
    setValue("toolBudgetTotal", total);
  }, [toolEntries, setValue]);

  return (
    <div className="space-y-3">
      <SectionHeader title="Requirements" />
      <div className="flex flex-col w-full gap-3">
        <InputField
          name="numberOfVacancy"
          label="Number of Vacancies"
          inputMode="number"
          onChange={(val) => {
            const digitsOnly = val.replace(/\D+/g, "");
            setValue("numberOfVacancy", digitsOnly);
          }}
          required
          rules={{
            min: { value: 1, message: "Minimum 1 vacancy" },
            max: { value: 20, message: "Too many vacancies" },
          }}
          disabled={isDisable}
        />
        <TagSelectField
          required
          placeholder="Select Skills"
          disabled={isDisable}
          name="skills"
          label="Skills"
          options={skillOptions}
        />
        <SectionHeader title="Tool Details" />
        <SelectField
          name="tools"
          label="Tool Name"
          placeholder="Select Tool"
          options={toolOptions}
          disabled={isDisable}
        />
        <FileUpload
          name="toolImages"
          label="Tool Image (PNG, JPEG, PDF)"
          accept=".png,.jpeg,.jpg,.pdf"
          placeholder="Upload tool files"
          disabled={isDisable}
          key={toolImageInputKey}
        />
      </div>
      <InputField
        name="toolBudgetNotes"
        label="Tool Cost"
        placeholder="Enter tool cost"
        inputMode="number"
        onChange={(val) => {
          const digitsOnly = val.replace(/\D+/g, "");
          setValue("toolBudgetNotes", digitsOnly);
        }}
        rules={{
          validate: (val) => {
            if (val === undefined || val === null || val === "") return true;
            const num = Number(val);

            if (Number.isNaN(num) || num <= 0) {
              return "Enter a valid amount (minimum 1)";
            }

            if (num > 10_000_000) {
              return "Max allowed amount is 10,000,000";
            }

            return true;
          },
        }}
        disabled={isDisable}
      />
      <div className="flex justify-end">
        <Button
          variant="outline"
          className="rounded-md"
          onClick={handleAddToolEntry}
          disabled={isDisable}
        >
          {editingToolIndex !== null ? "Update Tool Entry" : "Add Tool Entry"}
        </Button>
      </div>
      {toolEntries.length > 0 && (
        <div className="space-y-2">
          <SectionHeader title="Tool Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {toolEntries.map((entry, idx) => (
              <div
                key={`${entry.name}-${idx}`}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5 text-sm text-gray-900 dark:text-gray-100">
                    <div>
                      <span className="font-semibold">Tool Name:</span>{" "}
                      <span className="font-normal">{entry.name}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Tool Cost:</span>{" "}
                      <span className="font-normal">{entry.budget}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      className="rounded-md px-2.5 py-1 text-xs h-8"
                      onClick={() => handleEditToolEntry(idx)}
                      disabled={isDisable}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      className="rounded-md px-2.5 py-1 text-xs h-8"
                      onClick={() => handleRemoveToolEntry(idx)}
                      disabled={isDisable}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                {entry.images.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      <span className="font-semibold">Tool Image:</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                      {entry.images.map((img, imageIdx) => (
                        <div
                          key={`${img.name}-${imageIdx}`}
                          className="h-11 w-11 overflow-hidden rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                        >
                          <img
                            src={img.url}
                            alt={img.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RequirementsSection;
