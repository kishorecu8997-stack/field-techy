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

interface ProfileCardProps {
  profile: {
    name: string;
    rating: number;
    reviewCount: number;
    jobTitle: string;
    location: string;
    imageUrl: string;
  };
  onInviteClick: () => void;
}

export interface JobInvite {
  id: number;
  title: string;
  date: string;
  location: string;
  duration: string;
  serviceType: string;
  price: string;
}

export interface SelectedJobCardId {
  id: number[];
}
