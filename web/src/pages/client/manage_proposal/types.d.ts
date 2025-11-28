interface EngineerCardProps {
  engineer: {
    name: string;
    rating: number;
    reviewCount: number;
    title: string;
    imageUrl: string;
    pay_type?: string;
    availability?: string;
  };
}

interface EngineerCardListProps {
    name: string;
    rating: number;
    bidAmount:string;
    payType:string;
    reviewCount: number;
    title: string;
    availability:string;    
    imageUrl: string;
    status:string;    
}

export interface ProposalListType {
  id: number;
  engineerName: string;
  ratings: string;
  reviewCount: string;
  bitAmount: string;
  payType: string;
  availability: string;
  jobID: number;
  jobName: string;
  proposal: string;
  portfolioDoc: string;
}

export interface proposalEngineer {
  id: number;
  name: string;
  ratings: string;
  designation: string;
}