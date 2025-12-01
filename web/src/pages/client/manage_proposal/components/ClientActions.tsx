import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { useNavigate } from "react-router-dom";

/**
 * ClientActions Component
 * Renders the actions section for the Manage Proposal page, including a button to invite a new job.
 * @returns {JSX.Element} The rendered actions section
 * */
const ClientActions = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-row justify-end">
      <Button
        variant="primary"
        onClick={() => {
          navigate(absoluteUrls.client.home.SelectEngineer);
        }}
      >
        Invite a job
      </Button>
    </div>
  );
};

export default ClientActions;
