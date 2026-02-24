export interface RevisionFormData {
  title?: string;
  notes: string;
  attachment?: FileList;
}

export interface RevisionRequestDetails {
  title: string;
  notes: string;
  attachmentName?: string;
  timestamp: string;
}
