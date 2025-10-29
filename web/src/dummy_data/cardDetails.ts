export interface Card {
  id: string;
  number: string;
  type: string;
  title: string;
  icon: string;
}

export const cards: Card[] = [
  {
    id: "1",
    number: "xxxx xxxx xxxx 5678",
    type: "V",
    title: "Mobile App UI/UX Designer",
    icon: "V",
  },
  {
    id: "2",
    number: "xxxx xxxx xxxx 5678",
    type: "M",
    title: "Mobile App UI/UX Designer",
    icon: "M",
  },
];
