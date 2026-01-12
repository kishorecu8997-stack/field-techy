import type { InformationCardProps } from "@/shared/components/type";

// 1. Education Card
const educationCard: InformationCardProps = {
  title: "Education",
  description: "Post Graduate",
  details: [
    { label: "Degree", value: "Master of Science" },
    { label: "University", value: "Chandigarh University" },
    { label: "Major", value: "Computer Science" },
    { label: "Graduation Year", value: "2018" },
    { label: "CGPA", value: "8.7/10" },
  ],
};

// 2. Work Experience Card
const workExperienceCard: InformationCardProps = {
  title: "Experience",
  description: "Angular Developer",
  details: [
    { label: "Current Role", value: "Senior Frontend Developer" },
    { label: "Company", value: "Tech Innovations Inc." },
    { label: "Location", value: "Remote (San Francisco, CA)" },
    { label: "Start Date", value: "June 2020" },
    {
      label: "Previous Role",
      value: "Frontend Developer at Digital Solutions LLC",
    },
  ],
};
// Array of all cards for easy mapping
const informationCardsData: InformationCardProps[] = [
  educationCard,
  workExperienceCard,
];

export default informationCardsData;
