import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs/InputField";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { validateName } from "@/shared/libs/utils";
import { validateEmail, validatePhone } from "@/utils/validate";

const ClientFields = () => {
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
          <InputField
            required
            label="Phone"
            name="mobile"
            placeholder="Client Phone"
            rules={{ validate: (v) => validatePhone(v) }}
          />
          <SelectField
            label="Contact Type"
            name="contactType"
            required
            options={[]}
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

export default ClientFields;
