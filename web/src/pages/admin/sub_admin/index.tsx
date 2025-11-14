import RolePage from "./role_pages/RolePage";

/**
 * ManageSubAdmin Component
 *
 * Renders a management dashboard for sub-admins.
 * Displays role details in a searchable and paginated table, allowing admins to:
 * - View role details
 * - Edit or delete specific roles
 *
 * @component
 * @example
 * return (
 *   <ManageSubAdmin />
 * );
 *
 * @returns {JSX.Element} The rendered ManageSubAdmin component.
 */
export default function ManageSubAdmin() {
  return (
    <div className="w-full h-full">
      <RolePage />
    </div>
  );
}
