import { Button } from "@/shared/components/commonUI/Buttons";
import Popup from "@/shared/components/Popup";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { VscChromeClose } from "react-icons/vsc";

export default function MemberPopup({
  isMember,
  setIsMember,
}: {
  isMember: boolean;
  setIsMember: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { setActiveKey, setISOpenSidebar } = useDrawerStore();

  return (
    <div>
      <Popup
        open={isMember}
        onClose={() => setIsMember(false)}
        inputClassName="w-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
      >
        <div className="p-4">
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold dark:text-white">Select an Option</h3>
            <VscChromeClose
              className="cursor-pointer dark:text-white"
              onClick={() => setIsMember(false)}
            />
          </div>
          <div className="grid space-y-2">
            <Button
              className="w-full rounded-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 hover:opacity-90 transition"
              onClick={() => {
                setIsMember(false);
                setActiveKey("addProjectMember");
                setISOpenSidebar(true);
              }}
            >
              Add New Member
            </Button>
            <Button
              className="w-full rounded-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 hover:opacity-90 transition"
              onClick={() => {
                setIsMember(false);
                setActiveKey("addExistingProjectMember");
                setISOpenSidebar(true);
              }}
            >
              Add Existing FT Member
            </Button>
          </div>
        </div>
      </Popup>
    </div>
  );
}
