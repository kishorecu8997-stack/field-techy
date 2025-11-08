import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { useNavigate } from "react-router-dom";

/**
 * ManageEngineer component for managing engineer-related operations in the admin panel.
 * 
 * This component provides an interface for:
 * - Viewing a list of engineers
 * - Adding new engineers through a navigation button
 * - Exporting engineer data to CSV format
 * 
 * @component
 * @example
 * ```tsx
 * <ManageEngineer />
 * ```
 * 
 * @returns {JSX.Element} A component with engineer management controls and actions
 */
export default function ManageEngineer() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex justify-between">
        <p className="mt-2 mb-6 font-semibold">Manage engineer</p>
        <div className="flex gap-4">
          <Button
            type="submit"
            className="w-fit bg-gradient-to-r bg-teal-900 text-white"
            onClick={() =>
              navigate(`${absoluteUrls.admin.home.manage_engineer_add}`)
            }
          >
            Add Engineer
          </Button>
          <Button variant="solid" className="">
            Export CSV
          </Button>
        </div>
      </div>
    </div>
  );
}
