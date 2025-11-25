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