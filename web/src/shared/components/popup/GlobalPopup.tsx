import { usePopupStore } from "@/shared/store/popupStore";
import { GenericPopup } from "./GenericPopup";

export function GlobalPopup() {

    console.log("GlobalPopup rendered");
  const popup = usePopupStore((s) => s.popup);
  const closePopup = usePopupStore((s) => s.closePopup);

  if (!popup.isOpen || !popup.props) return null;

  return (
    <div
      className="fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-black/50 animate-fade-in"
      style={{
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closePopup(null);
      }}
    >
      <div className="w-full sm:max-w-md sm:rounded-lg sm:shadow-xl max-h-full flex flex-col bg-white dark:bg-gray-800 sm:inset-auto fixed sm:relative h-full sm:h-auto">
        <GenericPopup {...popup.props} onClose={closePopup} />
      </div>
    </div>
  );
}
