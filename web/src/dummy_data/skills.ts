export interface Skill {
  name: string;
  selected: boolean;
}

export const initialSkills: Skill[] = [
  { name: 'Figma', selected: true },
  { name: 'Adobe XD', selected: false },
  { name: 'PhotoShop', selected: false },
  { name: 'Motion Graphics', selected: false },
  { name: 'Animations', selected: false },
  { name: 'UI/UX', selected: false },
  { name: 'SQL', selected: false },
  { name: 'PowerPoint', selected: false },
  { name: 'Adobe Suit', selected: false },
];