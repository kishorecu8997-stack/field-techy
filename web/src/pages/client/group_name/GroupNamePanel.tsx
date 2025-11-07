// src/components/messages/GroupNamePanel.tsx
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import ImageUploaderField from "@/shared/components/commonUI/inputs/ImageUploaderField";
import { InputField } from "@/shared/components/commonUI/inputs";
import React from "react";
import { useForm } from "react-hook-form";

interface GroupNameForm {
  groupName: string;
  profileImage: string | File | null;
}

const GroupNamePanel: React.FC = () => {
  const methods = useForm<GroupNameForm>({
    defaultValues: {
      groupName: "",
      profileImage: null,
    },
  });

  const { watch } = methods;
  const groupName = watch("groupName");

  const handleCreateGroup = (data: GroupNameForm) => {
    console.log("Creating group:", data.groupName);
    alert(`Group "${data.groupName}" created!`);
  };

  return (
    <FormContainer methods={methods} onSubmit={handleCreateGroup}>
      {/* Full panel container — add min-h-0 to allow flex children to work in constrained space */}
      <div className="max-w-md w-full max-h-full flex flex-col min-h-0">
        {/* Scrollable content (above button) */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Avatar uploader centered */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24">
              <ImageUploaderField name="profileImage" />
            </div>
          </div>

          {/* Group Name Input */}
          <div>
            <InputField
              name="groupName"
              label="Group Name"
              required
              placeholder="Enter Group Name"
              inputClassName="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-800 focus:border-teal-800"
            />
          </div>
        </div>

        {/* Create Group Button — now sticks to bottom */}
        <div className="px-6 pb-6">
          <button
            type="submit"
            disabled={!groupName?.trim()}
            className={`w-full py-3 rounded-lg font-medium text-white transition ${
              !groupName?.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-800 hover:bg-teal-900"
            }`}
          >
            Create Group
          </button>
        </div>
      </div>
    </FormContainer>
  );
};

export default GroupNamePanel;