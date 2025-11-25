import React, { useState } from "react";
import {
  LOCATION_OPTIONS,
  BUDGET_OPTIONS,
  RATING_OPTIONS,
} from "@/shared/libs/constants/filterOptions";
import type {
  BudgetValue,
  RatingValue,
} from "@/shared/libs/constants/filterOptions";
import type { LocationValue } from "@/shared/libs/constants/filterOptions";
import { initialSkills, type Skill } from "@/dummy_data/InitialSkill";
import { Button } from "./commonUI/Buttons";

const Filters: React.FC = () => {
  const [location, setLocation] = useState<LocationValue>("all");
  const [budget, setBudget] = useState<BudgetValue>("hourly");
  const [rating, setRating] = useState<RatingValue>("1");
  const [experience, setExperience] = useState<number>(5);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [showAllSkills, setShowAllSkills] = useState<boolean>(false);

  const toggleSkill = (index: number) => {
    setSkills((prev) =>
      prev.map((skill, i) =>
        i === index ? { ...skill, selected: !skill.selected } : skill
      )
    );
  };

  const clearAllFilters = () => {
    setLocation("all");
    setBudget("hourly");
    setRating("1");
    setExperience(5);
    setSkills(
      initialSkills.map((skill) =>
        skill.name === "Figma"
          ? { ...skill, selected: true }
          : { ...skill, selected: false }
      )
    );
  };

  const visibleSkills = showAllSkills ? skills : skills.slice(0, 6);

  return (
    <div className="p-4 md:p-6 rounded-lg bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-white transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Filters</h2>
        <Button
          onClick={clearAllFilters}
          className="text-sm font-medium text-teal-800 hover:text-gray-50 dark:text-gray-100 dark:hover:text-gray-400 underline"
        >
          CLEAR ALL
        </Button>
      </div>

      {/* Location */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Location</h3>
        <div className="flex flex-wrap gap-2">
          {LOCATION_OPTIONS.map((option) => (
            <Button
              key={option.value}
              onClick={() => setLocation(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors  ${
                location === option.value
                  ? 'bg-teal-800 dark:bg-teal text-white'
                : ' dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-teal-500 dark:hover:bg-gray-700'
              }`}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Budget</h3>
        <div className="flex flex-wrap gap-2">
          {BUDGET_OPTIONS.map((option) => (
            <Button
              key={option.value}
              onClick={() => setBudget(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors  ${
                budget === option.value
                  ? 'bg-teal-800 dark:bg-teal text-white'
                : ' dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-teal-500 dark:hover:bg-gray-700'
              }`}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Rating</h3>
        <div className="flex flex-wrap gap-2">
          {RATING_OPTIONS.map((option) => (
            <Button
              key={option.value}
              onClick={() => setRating(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors  ${
                rating === option.value
                  ? 'bg-teal-800 dark:bg-teal text-white'
                : ' dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-teal-500 dark:hover:bg-gray-700'
              }`
              }
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="mb-6">
        <h3 className="font-medium mb-6">Experience</h3>
        <div className="relative px-2">
          {" "}
          {/* Added px-2 for tooltip breathing room */}
          <input
            type="range"
            min="0"
            max="10"
            value={experience}
            onChange={(e) => setExperience(parseInt(e.target.value) || 0)}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-300 dark:bg-gray-600"
            style={{
              background: `linear-gradient(to right, #059669 0%, #059669 ${
                (experience / 10) * 100
              }%, #d1d5db ${(experience / 10) * 100}%, #d1d5db 100%)`,
            }}
          />
          {/* Dynamic tooltip */}
          <div
            className="absolute top-[-22px] transform -translate-x-1/2 px-2 py-1 rounded-2xl text-xs font-medium whitespace-nowrap bg-emerald-700 text-white dark:bg-emerald-600"
            style={{
              left: `${(experience / 10) * 100}%`,
            }}
          >
            {experience === 0
              ? "No Experience"
              : `${experience} ${experience === 1 ? "Year" : "Years"}`}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {visibleSkills.map((skill, index) => (
            <Button
              key={skill.name}
              onClick={() => toggleSkill(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors  ${
                skill.selected
                  ? 'bg-teal-800 dark:bg-teal text-white'
                : ' dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-teal-500 dark:hover:bg-gray-700'
              }`}
            >
              {skill.name}
            </Button>
          ))}
        </div>

        {skills.length > 6 && (
          <Button
            variant="text"
            onClick={() => setShowAllSkills(!showAllSkills)}
            className="mt-2 text-sm font-medium text-teal-700 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 underline"
          >
            {showAllSkills ? "Show Less" : "View All"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Filters;
