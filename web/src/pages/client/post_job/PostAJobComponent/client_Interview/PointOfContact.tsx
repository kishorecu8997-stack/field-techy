import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs/InputField";
import PhoneInputField from "@/shared/components/commonUI/inputs/PhoneInputField";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { validateName } from "@/shared/libs/utils";
import { validateEmail } from "@/utils/validate";

/*
 *  Point of Contact
 *    - Displays a form to add point of Contact
 *    - Uses react-hook-form for form state management
 *    - Submits form data to the server
 * @returns {JSX.Element} The rendered Point of Contact
 * @constructor
 */
const PointOfContact = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col overflow-auto flex-grow gap-2">
        <div className="">
          <InputField
            label="First Name"
            name="firstName"
            required
            placeholder="first Name"
            rules={{ validate: (v) => validateName(v) }}
          />
          <InputField
            required
            label="Last Name"
            name="lastName"
            placeholder="last Name"
            rules={{ validate: (v) => validateName(v) }}
          />
          <InputField
            label="Email"
            required
            name="email"
            placeholder="Client Email"
            rules={{ validate: (v) => validateEmail(v) }}
          />
          <PhoneInputField name="mobile" label="Client Phone" required />
          <SelectField
            label="Contact Type"
            name="contactType"
            required
            options={[
              { value: "Email", label: "Email" },
              { value: "Phone", label: "Phone" },
            ]}
          />
        </div>
      </div>
      <div className="mt-auto flex justify-end">
        <Button
          type="submit"
          className="bg-teal-800 hover:bg-teal-900 text-white px-6 py-2 rounded w-full"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default PointOfContact;
