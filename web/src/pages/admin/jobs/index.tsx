import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { useNavigate } from "react-router-dom";

export default function ManageJobs() {
  const navigate = useNavigate();
  return (
    <div>
      <Button onClick={() =>navigate(absoluteUrls.admin.home.manage_jobs_view)}>View Jobs</Button>
    </div>
  );
}
