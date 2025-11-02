// types.ts or skills.ts
export interface SkillOption {
  value: string;
  label: string;
}

const skill: SkillOption[] = [
  { value: "Tyscript", label: "Tyscript" },
  { value: "C#", label: "C#" },
  { value: "Java", label: "Java" },
  { value: "Python", label: "Python" },
  { value: "React", label: "React" },
  { value: "Angular", label: "Angular" },
  { value: "Vue", label: "Vue" },
  { value: "Node.js", label: "Node.js" },
  { value: "JavaScript", label: "JavaScript" },
  { value: "HTML", label: "HTML" },
  { value: "CSS", label: "CSS" },
  { value: "SQL", label: "SQL" },
  { value: "MongoDB", label: "MongoDB" },
  { value: "Express", label: "Express" },
  { value: "AWS", label: "AWS" },
  { value: "Azure", label: "Azure" },
  { value: "Next.js", label: "Next.js" },

  // ... add all your skills in this format
];

export default skill;
