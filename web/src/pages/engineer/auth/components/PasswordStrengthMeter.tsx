import React from "react";
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
  let strengthColor = "bg-gray-300"; // Default/Too Weak
  let strengthText = "Too Weak";

  if (metCriteriaCount === totalCriteriaCount) {
    strengthColor = "bg-green-500";
    strengthText = "Strong";
  } else if (metCriteriaCount >= totalCriteriaCount / 2) {
    strengthColor = "bg-orange-500";
    strengthText = "Medium";
  } else if (password.length > 0) {
    strengthColor = "bg-red-500";
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
          <strong style={{ color: strengthColor.split("-")[1] }}>
            {strengthText}
          </strong>
        </span>
      </div>

      {/* Progress Bar (using Tailwind CSS classes) */}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ease-out ${strengthColor}`}
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
            <span className="mr-2">{criterion.isValid ? "✔" : "✘"}</span>
            {criterion.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordStrengthMeter;
