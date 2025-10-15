import { InputField, TextareaInput } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import React from "react";
import { useForm } from "react-hook-form";
import Proposal from "../../../../shared/components/Proposal";
import type { JobInfoSectionProps } from "../../types";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import { Button } from "@/shared/components/commonUI/Buttons";

/**
 * Displays detailed job information including creation date, start date, tasks, and files.
 */
const JobInfoSection: React.FC<{
  jobInfo: JobInfoSectionProps;
  isSendProposal?: boolean;
}> = ({ jobInfo, isSendProposal }) => {
  const { jobTitle, terms, files } = jobInfo;

  return (
    <div className="">
      {!isSendProposal ? (
        <Proposal
          jobTitle={jobTitle}
          terms={terms}
          element={
            <div className="mt-5">
              <div className="flex flex-wrap gap-2">
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-md text-sm border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                  >
                    {file}
                  </div>
                ))}
              </div>
            </div>
          }
        />
      ) : (
        <div>
          <SendProposalJabINfo />
        </div>
      )}
    </div>
  );
};

export default JobInfoSection;

export const SendProposalJabINfo = () => {
  const formCtx = useForm();
  const handleSubmit = () => {
    console.log("Submitted");
  };

  return (
    <FormContainer methods={formCtx} onSubmit={handleSubmit}>
      <TextareaInput
        name="description"
        label="Job Description"
        required
        placeholder="Write your pitch to the client here..."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ">
        <InputField
          name="expected"
          label="Expected Pay"
          placeholder="e.g 3000"
          required
        />
        <SelectField
          name="type"
          label="Pay type"
          required
          options={[
            { value: "negotiable", label: "Negotiable" },
            { value: "fixed", label: "Fixed" },
          ]}
        />
      </div>
      <FileUpload name="attachment" label="Attachment" required />
      <SelectField
        name="availability"
        label="Availability"
        required
        options={[
          { value: "1", label: "1 hour" },
          { value: "2", label: "2 hours" },
          { value: "3", label: "3 hours" },
        ]}
      />
      <hr className="my-3 text-gray-600" />
      <div className="font-bold text-2xl">Screening Questions</div>
      <TextareaInput
        name="question"
        label="Why do you think you're a good fit for this job?"
        placeholder="Write your pitch to the client here..."
        required
      />
      <TextareaInput
        name="Describe"
        label="Describe a similar project you've worked on"
        placeholder="Write your pitch to the client here..."
        required
      />
      <Button className="w-fit bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition mt-5">
        Submit Proposal
      </Button>
    </FormContainer>
  );
};
