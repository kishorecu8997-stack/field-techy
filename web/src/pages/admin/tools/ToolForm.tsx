import { InputField } from "@/shared/components/commonUI/inputs";
import { validateCategoryName } from "@/utils/validate";
/**
 * `ToolForm` provides the form fields for creating or editing a tool.
 * It is designed to be used within a `FormContainer` that provides the `react-hook-form` context.
 * This component includes a text input for the tool name.
 *
 * @returns {JSX.Element} The rendered form fields for a tool.
 */

export default function ToolForm() {
  return (
    <div>
      <div className="flex md:w-1/2">
        <InputField
          name="toolName"
          label="Tool Name"
          type="text"
          placeholder="Enter Name"
          required
          rules={{ validate: (v: string) => validateCategoryName(v) }}
        />
      </div>
    </div>
  );
}
