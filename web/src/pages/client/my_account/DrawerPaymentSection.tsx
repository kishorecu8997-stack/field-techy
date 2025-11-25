import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import PaymentMethod from "../auth/components/profile_setup/PaymentMethod";

const DrawerPaymentSection = () => {
  const formCtx = useForm();
  const handleSubmit = (data: any) => {
    console.log(data);
  };
  return (
    <div>
      <FormContainer methods={formCtx} onSubmit={handleSubmit}>
        <PaymentMethod isHeader={false} />
      </FormContainer>
    </div>
  );
};

export default DrawerPaymentSection;
