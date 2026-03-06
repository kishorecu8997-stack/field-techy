interface EngineerCardProps {
  engineer: {
    id: string; // unique identifier used for navigation
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
  location: string; // may contain workLocationName or empty; detailed breakdown provided by ids
  countryId?: number;
  stateId?: number;
  cityId?: number;
  duration: string;
  jobType?: string;
  status?: string | null;
  serviceType: string;
  price: string;
}

export interface SelectedJobCardId {
  id: number[];
}
