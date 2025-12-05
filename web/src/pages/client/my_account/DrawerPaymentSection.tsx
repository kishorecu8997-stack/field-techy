import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import PaymentMethod from "../auth/components/profile_setup/PaymentMethod";

/*
 * DrawerPaymentSection
 *    - Displays a form to add payment method details
 * @returns {JSX.Element} The rendered DrawerPaymentSection component.
 */
const DrawerPaymentSection = () => {
  const formCtx = useForm();
  const handleSubmit = () => {
    console.log("Submitted");
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
