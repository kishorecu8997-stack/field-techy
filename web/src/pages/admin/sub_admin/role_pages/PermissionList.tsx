import AddRole from './AddRole'

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
  return (
    <div className="w-full h-full flex flex-col p-3 gap-3 ">
      <h1 className="text-xl font-semibold ">Edit Role</h1>
      <AddRole />
    </div>
  )
}

export default PermissionList
