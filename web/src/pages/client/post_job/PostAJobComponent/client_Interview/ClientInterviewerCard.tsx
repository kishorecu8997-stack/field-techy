import { Button } from "@/shared/components/commonUI/Buttons";
import useDrawerStore from "@/shared/store/useDrawerStore";

/*
 *  Client Interviewer Card
 *    - Displays a card with client interviewer details
 *    - Provides a button to edit the client interviewer
 * @returns {JSX.Element} The rendered Client Interviewer Card
 * @constructor 
 */
export default function ClientInterviewerCard() {
  const { setActiveKey, setISOpenSidebar } = useDrawerStore();

  return (
    <div className="bg-gray-300 rounded-xl p-6 w-full max-w-md shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">
        Client Interviewer
      </h3>

      <p className="text-sm text-gray-600 mt-2">
        No client interviewer has been added yet.
      </p>

      <Button
        type="button"
        onClick={() => {
          setActiveKey("clientInterviewer");
          setISOpenSidebar(true);
        }}
        className="mt-4 px-5 py-2 bg-teal-900 text-white rounded-full hover:bg-teal-800 transition"
      >
        Add Client Interviewer
      </Button>
    </div>
  );
}
