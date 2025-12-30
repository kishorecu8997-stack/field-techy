import React, { useState } from "react";
import DocumentsList, { type Document } from "./components/DocumentsList";
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
   * Handles adding a new certificate document.
   */
  const handleAddDocument = () => {
    const newCertificate: Document = {
      id: Math.max(...documents.map(d => d.id), 0) + 1,
      title: "Certificate",
      category: "certificate",
      fileName: "New Certificate.jpg",
      fileType: "JPEG",
      uploadDate: new Date().toISOString().split('T')[0],
      description: "New certificate document",
      status: "Pending",
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
    };
    setDocuments(prev => [...prev, newCertificate]);
    toast.success("New certificate added successfully");
  };

  /**
   * Handles adding multiple certificates from file upload.
   */
  const handleAddMoreCertificates = (files: FileList) => {
    const newCertificates: Document[] = [];
    const baseId = Math.max(...documents.map(d => d.id), 0);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validTypes: Document['fileType'][] = ["PDF", "PNG", "JPEG", "JPG", "GIF", "DOCX", "XLSX"];
      const extension = file.name.split('.').pop()?.toUpperCase();
      const fileType = validTypes.includes(extension as Document['fileType']) ? extension as Document['fileType'] : 'PDF';
      newCertificates.push({
        id: baseId + i + 1,
        title: "Certificate",
        category: "certificate",
        fileName: file.name,
        fileType,
        uploadDate: new Date().toISOString().split('T')[0],
        description: `Certificate document ${i + 1}`,
        status: "Pending",
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
      });
    }
    setDocuments(prev => [...prev, ...newCertificates]);
    toast.success(`${files.length} new certificates added successfully`);
  };

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

  /**
   * Handles updating the expiry date of a document.
   * @param {number} id - The ID of the document to update.
   * @param {string} expiryDate - The new expiry date.
   */
  const handleExpiryDateChange = (id: number, expiryDate: string) => {
    setDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, expiryDate } : doc));
    toast.success("Expiry date updated successfully");
  };

  return (
    <>
      <div className="p-4 max-w-3xl mx-auto">
        <DocumentsList
          documents={documents}
          onEditDocument={() => setActiveKey("editDocument")}
          onDeleteDocument={handleDeleteDocument}
          onExpiryDateChange={handleExpiryDateChange}
          onAddMoreCertificates={handleAddMoreCertificates}
          onAddSingleCertificate={handleAddDocument}
        />
      </div>
    </>
  );
};

export default Documents;
