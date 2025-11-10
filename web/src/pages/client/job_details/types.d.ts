export interface JobCardProps {
  title: string;
  hours: number;
  client: string;
  status: string;
  onApprove: () => void;
  onRequestRevision: () => void;
}
