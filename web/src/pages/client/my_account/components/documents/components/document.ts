export interface Document {
  id: number;
  title: string;
  fileName: string;
  fileType: "PDF" | "PNG" | "JPEG" | "JPG" | "GIF" | "DOCX" | "XLSX";
  previewUrl?: string;
  uploadDate?: string;
  description?: string;
  /** A key-value store for any additional metadata. Values can be undefined. */
  metadata?: Record<string, string | undefined>;
}
