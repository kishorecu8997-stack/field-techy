import ViewFileComponent from "../../tab_components/ViewFileComponent";

interface DocumentViewProps {
  govIdDoc?: string;
  certificateDoc?: string;
}

/**
 * DocumentView component displays the client's uploaded documents.
 * It shows the "Government ID Proof" and "Certificate" if provided, otherwise placeholders.
 *
 * @component
 * @returns {JSX.Element} The rendered DocumentView component.
 */
export default function DocumentView({
  govIdDoc,
  certificateDoc,
}: DocumentViewProps) {
  return (
    <div className="flex p-4 gap-4 bg-white dark:bg-neutral-800 rounded-md shadow-sm">
      <div className="grid md:flex mb-6 mt-2 gap-10">
        <div className="w-96">
          <ViewFileComponent
            onClose={() => {}}
            titleClassName="text-sm"
            title="Government ID Proof"
            isShowIcon={false}
            fileType="govIdDoc"
            fileUrl={govIdDoc}
          />
        </div>

        <div className="w-96">
          <ViewFileComponent
            onClose={() => {}}
            titleClassName="text-sm"
            isShowIcon={false}
            title="Certificate"
            fileType="certificateDoc"
            fileUrl={certificateDoc}
          />
        </div>
      </div>
    </div>
  );
}
