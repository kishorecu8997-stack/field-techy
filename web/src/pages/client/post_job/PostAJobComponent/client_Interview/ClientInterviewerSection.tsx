import { Button } from "@/shared/components/commonUI/Buttons";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import type {
  ClientInterviewerSectionProps,
  DetailsType
} from "../../types";
import SectionHeader from "../SectionHeader";

export default function ClientInterviewerSection({
  interviewers,
  onAdd,
  onDelete,
  onEdit,
  composeDetails,
}: ClientInterviewerSectionProps) {
  
  // Throw an error in development if composeDetails is missing
  if (!composeDetails) {
    console.error("❌ composeDetails prop is required for ClientInterviewerSection");
    return <div>Error: composeDetails function is missing.</div>;
  }

  // Card component inside
  const ClientInterviewerCard = ({
    title,
    details,
    onEdit,
    onDelete,
  }: {
    title: string;
    details: DetailsType;
    onEdit?: () => void;
    onDelete?: () => void;
  }) => (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-800">{title}</h4>

        <div className="flex gap-3 text-teal-900 cursor-pointer">
          <div onClick={onEdit}>
            <FiEdit2 className="text-lg hover:text-teal-700" />
          </div>
          <div onClick={onDelete}>
            <FiTrash2 className="text-lg hover:text-red-600" />
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-700 space-y-1">
        {details.map((item, idx) => {
          if ("section" in item) {
            return (
              <div key={idx} className="py-3">
                <SectionHeader title={item.section} />
              </div>
            );
          }

          return (
            <div key={idx} className="flex justify-between">
              <span className="font-semibold">{item.label}</span>
              <span>{item.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 rounded-xl p-4 w-full max-w-md shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        Client Interviewer
      </h3>

      <div className="max-h-[90vh] overflow-y-auto pr-2 space-y-3">
        {interviewers.map((interviewer, index) => {
          const details = composeDetails(interviewer); // REQUIRED

          return (
            <ClientInterviewerCard
              key={interviewer.id}
              title={`Client Interviewer ${index + 1}`}
              details={details}
              onEdit={() => onEdit?.(Number(interviewer.id))}
              onDelete={() => onDelete?.(Number(interviewer.id))}
            />
          );
        })}
      </div>

      <Button
        onClick={onAdd}
        className="mt-4 px-5 py-2 bg-teal-900 text-white rounded-full hover:bg-teal-800 transition"
      >
        Add Client Interviewer
      </Button>
    </div>
  );
}
