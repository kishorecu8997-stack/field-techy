import { Button } from "@headlessui/react";
import AddRole from "./AddRole";
import { useNavigate } from "react-router-dom";

/**
 * PermissionList Component
 *
 * Renders a form for creating or editing a role.
 * Includes sections for role details and permissions.
 *  @component
 * @returns {JSX.Element} The rendered PermissionList component.
 *
 * @example
 * // Example usage:
 * <PermissionList />
 *
 */
const PermissionList = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex flex-col p-3 gap-3 ">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold ">Edit Role</h1>
        <Button
          className="bg-neutral-800 text-white px-4 py-2 rounded-md hover:bg-neutral-700 w-fit cursor-pointer"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </div>
      <AddRole />
    </div>
  );
};

export default PermissionList;
