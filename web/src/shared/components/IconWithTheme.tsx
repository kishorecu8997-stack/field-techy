import React from "react";

interface LogoProps {
  lightLogo: string; // image for light theme
  darkLogo: string; // image for dark theme
  className?: string; // optional styling
}

const IconWithTheme: React.FC<LogoProps> = ({
  lightLogo,
  darkLogo,
  className = "",
}) => {
  return (
    <div className={`h-20 w-24 ${className}`}>
      <img
        src={lightLogo}
        alt="logo"
        className="block dark:hidden h-full w-full object-contain"
      />

      <img
        src={darkLogo}
        alt="logo-dark"
        className="hidden dark:block h-full w-full object-contain"
      />
    </div>
  );
};

export default IconWithTheme;
