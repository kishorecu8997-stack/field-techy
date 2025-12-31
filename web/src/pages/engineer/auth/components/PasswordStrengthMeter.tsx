import React from "react";
import { icons } from "@/config/icons";
interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
}) => {
  // Define password strength criteria
  const criteria = [
    {
      name: "8-20 characters",
      isValid: password.length >= 8 && password.length <= 20,
    },
    { name: "One lowercase letter", isValid: /[a-z]/.test(password) },
    { name: "One uppercase letter", isValid: /[A-Z]/.test(password) },
    { name: "One number", isValid: /\d/.test(password) },
    { name: "One special character", isValid: /[^A-Za-z0-9]/.test(password) },
    { name: "No spaces", isValid: !/\s/.test(password) },
  ];

  // Calculate the score based on criteria
  const metCriteriaCount = criteria.filter((c) => c.isValid).length;
  const totalCriteriaCount = criteria.length;
  const strengthPercentage = (metCriteriaCount / totalCriteriaCount) * 100;

  // Determine the color/strength level
let strengthBg = "bg-gray-300";
let strengthTextColor = "text-gray-500";
let strengthText = "Too Weak";

if (metCriteriaCount === totalCriteriaCount) {
  strengthBg = "bg-green-500";
  strengthTextColor = "text-green-600";
  strengthText = "Strong";
} else if (metCriteriaCount >= totalCriteriaCount / 2) {
  strengthBg = "bg-orange-500";
  strengthTextColor = "text-orange-600";
  strengthText = "Medium";
} else if (password.length > 0) {
  strengthBg = "bg-red-500";
  strengthTextColor = "text-red-600";
  strengthText = "Weak";
}


  if (password.length === 0) {
    return null; // Hide the meter if the input is empty
  }

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">
          Strength:{" "}
          <strong className={strengthTextColor}>
            {strengthText}
          </strong>
        </span>
      </div>

      {/* Progress Bar (using Tailwind CSS classes) */}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ease-out ${strengthBg}`}
          style={{ width: `${strengthPercentage}%` }}
        />
      </div>

      <ul className="mt-3 text-xs text-gray-600 space-y-1">
        {criteria.map((criterion) => (
          <li
            key={criterion.name}
            className={`flex items-center ${
              criterion.isValid ? "text-green-600" : "text-red-500"
            }`}
          >
            <span className="mr-2">{criterion.isValid ? 
            <icons.checkmark /> 
            : <icons.close />}</span>
            {criterion.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordStrengthMeter;
