import AddCard from "../AddCard";
import Popup from "../Popup";

/**
 * @typedef {object} AddPaymentMethodProps
 * @property {boolean} isOpen - Controls whether the popup is visible.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setIsOpen - Function to update the visibility state of the popup.
 */

/**
 * A component that renders the `AddCard` form within a `Popup` modal.
 * This component is used to display a modal for adding a new payment method.
 * @param {AddPaymentMethodProps} props - The props for the component.
 */
const AddPaymentMethod = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: any;
}) => {
  return (
    <Popup open={isOpen} onClose={() => setIsOpen(false)}>
      <AddCard
        onClose={() => setIsOpen(false)}
        onAddCard={() => console.log("clicked")}
      />
    </Popup>
  );
};

export default AddPaymentMethod;
