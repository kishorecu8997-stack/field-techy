export interface JobDataProps {
  id: string;
  clientDetails: {
    name: string;
    email: string;
    phone: string;
  };
  engineerDetails: {
    name: string;
    email: string;
    phone: string;
  };
  company: string;
  title: string;
  description: string;
  companyLogo: string;
  category: string;
  jobType: string;
  locationType: string;
  salary: string;
  country: string;
  state: string;
  city: string;
  createdDate: string;
  status: "completed" | "pending" | "in-progress";
}


export interface PaymentListProps {
  id: string | number;
  amount: string;
  clientStatus: string;
  adminStatus: string;
}