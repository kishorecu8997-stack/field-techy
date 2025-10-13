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
  // ... add all your skills in this format
];

export default skill;