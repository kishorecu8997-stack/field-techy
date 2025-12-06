// src/pages/GroupNamePage.tsx

import GroupNamePanel from "./GroupNamePanel";

/**
 * GroupNamePage component displays a form for creating a new group.
 * It includes an avatar uploader and a text input for the group name.
 *
 * @returns {JSX.Element} The GroupNamePage component.  
 */
function GroupNamePage() {
  return (
    <div className="flex justify-center items-start min-h-screen p-4 bg-gray-50">
      <GroupNamePanel />
    </div>
  );
}

export default GroupNamePage;