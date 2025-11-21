import { InputField } from "@/shared/components/commonUI/inputs/InputField";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";

const PointOfContent = () => {
  return (
    <div className="flex-1">
      <InputField
        label="First Name"
        name="firstName"
        required
        placeholder="first Name"
      />
      <InputField
        required
        label="Last Name"
        name="lastName"
        placeholder="last Name"
      />
      <InputField
        label="Email"
        required
        name="email"
        placeholder="Client Email"
      />
      <InputField
        required
        label="Phone"
        name="mobile"
        placeholder="Client Phone"
      />
      <SelectField
        label="Contact Type"
        name="contactType"
        required
        options={[]}
      />
    </div>
  );
};

export default PointOfContent;
