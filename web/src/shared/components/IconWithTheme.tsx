import React from "react";

interface LogoProps {
  lightLogo: string; // image for light theme
  darkLogo: string; // image for dark theme
  className?: string; // optional styling
  forceTheme?: "light" | "dark";
  onClick?: () => void;
}

/**
 *
 * Icon component that switches between light and dark logos based on the current theme.
 *
 * This component takes in two image URLs for the light and dark themes, and renders
 * the appropriate logo based on the current theme. It uses the `className` prop to
 * apply additional styling to the logo container.
 *
 * @param param0
 * @returns
 */
const IconWithTheme: React.FC<LogoProps> = ({
  lightLogo,
  darkLogo,
  className = "",
  forceTheme,
  onClick,
}) => {
  return (
    <div
      className={`h-8 w-24 ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
      role={onClick ? "button" : undefined}
    >
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
