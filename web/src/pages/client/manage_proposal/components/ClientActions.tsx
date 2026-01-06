import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { createPathBuilder } from "@/utils";
import { useNavigate, useParams } from "react-router-dom";

/**
 * ClientActions Component
 * Renders the actions section for the Manage Proposal page, including a button to invite a new job.
 * @returns {JSX.Element} The rendered actions section
 * */
const ClientActions = () => {
  const navigate = useNavigate();

  const { id, jobId } = useParams();

  const makeUrl = createPathBuilder(absoluteUrls.client.home.SelectEngineer);
  const URl = makeUrl({ id: String(id || jobId) });

  return (
    <div className="flex flex-row justify-end">
      <Button
        variant="primary"
        onClick={() => {
          navigate(URl);
        }}
      >
        Invite to Job
      </Button>
    </div>
  );
};

export default ClientActions;
