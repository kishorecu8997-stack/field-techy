import type { Document } from "@/pages/engineer/user_profile/components/documents/components/DocumentsList";

// Local document/image assets from src/assets/document
import img8140054 from "@/assets/document/Certificate.jpg";
import img8351119 from "@/assets/document/Government-ID.jpg";
import imgExampleJpg from "@/assets/document/Government-ID1.jpg";
import sampleLocalPdf from "@/assets/document/Resume.pdf";

/**
 * Initial sample data for documents.
 * This data is used to populate the documents list for demonstration and development purposes.
 * It includes various file types like JPEG and PDF, with metadata.
 */
export const initialDocuments: Document[] = [
  {
    id: 1,
    title: "Certificate",
    fileName: "Certificate.jpg",
    fileType: "JPEG",
    previewUrl: img8140054,
    uploadDate: "2022-11-01",
    description: "Scanned document image stored locally in assets/document",
    metadata: {
      Source: "Local assets/document",
      Note: "Image for preview/testing",
    },
  },
  {
    id: 2,
    title: "Government-ID",
    fileName: "Government-ID.jpg",
    fileType: "JPEG",
    previewUrl: img8351119,
    uploadDate: "2022-11-02",
    description: "Scanned document image stored locally in assets/document",
    metadata: {
      Source: "Local assets/document",
    },
  },
  {
    id: 3,
    title: "Government-ID1",
    fileName: "Government-ID1.jpg",
    fileType: "JPEG",
    previewUrl: imgExampleJpg,
    uploadDate: "2021-06-15",
    description: "Example JPEG file included in project assets",
    metadata: {
      Size: "~100KB",
    },
  },
  {
    id: 4,
    title: "Resume",
    fileName: "Resume.pdf",
    fileType: "PDF",
    previewUrl: sampleLocalPdf,
    uploadDate: "2021-06-16",
    description: "Sample local PDF stored in assets/document",
    metadata: {
      Pages: "2",
    },
  },
  // {
  //   id: 5,
  //   title: "External Document",
  //   fileName: "invoice-2023.pdf",
  //   fileType: "PDF",
  //   // This URL comes from an external source (like an API or database)
  //   // It's a full, absolute URL string.
  //   previewUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  //   uploadDate: "2023-05-20",
  //   description: "A document hosted on an external server.",
  //   metadata: {
  //     Source: "External Server",
  //   },
  // },
];
