import React, { useState } from "react";
import DocumentsList from "./components/DocumentsList";
import { toast } from "react-toastify/unstyled";
import { initialDocuments } from "@/dummy_data/documents";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";


/**
 * The Documents component manages and displays a user's documents.
 * @param {DrawerMenuProps} props - The props for the component.
 * @param {function(string): void} props.onMenuItemClick - Callback to navigate to other profile sections.
 * @param {function(): void} props.onClose - Callback to close the parent drawer/sidebar.
 * @returns {React.ReactElement} The rendered Documents component.
 */
const Documents: React.FC= () => {
  const [documents, setDocuments] = useState(initialDocuments);
  const { showPopup } = usePopupStore();
  const { setActiveKey } = useDrawerStore();
 
  /**
   * Handles the deletion of a document after user confirmation.
   * @param {number} id - The ID of the document to be deleted.
   */
  const handleDeleteDocument = async(id: number) => {
    await showPopup({
      title: "Delete Document",
          body: "Are you sure you want to delete the document?",
          actionButtons: [
            {
              label: "Cancel",
              value: "no",
              variant:"secondary",
              action: async (close) => {
                console.log("No button clicked");
                close(true);
              },
            },
            {
              label: "Yes, delete",
              value: "yes",
              variant:"primary",
              action: async (close) => {
                toast.success("Document Deleted Successfully");
                console.log("Form submitted with data:", id);
                close(true);
                setActiveKey("profile");
              },
            },
          ],
        });    
  };

  return (
    <>     
      <div className="p-4 max-w-3xl mx-auto">
        <DocumentsList
          documents={documents}          
          onEditDocument={() => setActiveKey("editDocument")}
          onDeleteDocument={handleDeleteDocument}
        />
      </div>
    </>
  );
};

export default Documents;
