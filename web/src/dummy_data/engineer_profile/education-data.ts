interface Option {
  key: string;
  label: string;
}

export const educationLevels: Option[] = [
  { key: "high_school", label: "High School" },
  { key: "diploma", label: "Diploma" },
  { key: "graduate", label: "Graduate" },
  { key: "post_graduate", label: "Post Graduate" },
  { key: "phd", label: "PhD" },
];

export const courses: Option[] = [
  { key: "bsc", label: "Bachelor of Science" },
  { key: "ba", label: "Bachelor of Arts" },
  { key: "bcom", label: "Bachelor of Commerce" },
  { key: "msc", label: "Master of Science" },
  { key: "ma", label: "Master of Arts" },
  { key: "mcom", label: "Master of Commerce" },
  { key: "phd", label: "PhD" },
];

export const universities: Option[] = [
  { key: "chandigarh_university", label: "Chandigarh University" },
  { key: "delhi_university", label: "Delhi University" },
  { key: "mumbai_university", label: "Mumbai University" },
  { key: "iit_bombay", label: "IIT Bombay" },
  { key: "iit_delhi", label: "IIT Delhi" },
  { key: "other", label: "Other" },
];

export const majors: Option[] = [
  { key: "computer_science", label: "Computer Science" },
  { key: "mathematics", label: "Mathematics" },
  { key: "physics", label: "Physics" },
  { key: "chemistry", label: "Chemistry" },
  { key: "biology", label: "Biology" },
  { key: "economics", label: "Economics" },
  { key: "other", label: "Other" },
];

interface EducationEntry {
  id: number;
  level: string;
  course: string;
  university: string;
  major: string;
  year: string;
}

export const educationEdit: EducationEntry[] = [
  {
    id: 1,
    level: "post_graduate",
    course: "msc",
    university: "chandigarh_university",
    major: "computer_science",
    year: "2018",
  },
];

export const educationList = [
  {
    id: 1,
    level: "Post Graduate",
    course: "Master of Science",
    university: "Chandigarh University",
    major: "Computer Science",
    year: "2018",
  },
];
