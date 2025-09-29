import React from "react";

/**
 * LoaderComponent
 *
 * A spinner made of 8 animated dots arranged in a circle.
 * Each dot fades in and out with a staggered delay.
 *
 * @returns {JSX.Element}
 */
const LoaderComponent: React.FC = () => {
  const indices = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="relative flex items-center justify-center w-12 h-12">
      {indices.map((i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-black dark:bg-white absolute"
          style={{
            transform: `rotate(${i * 45}deg) translate(1.5rem)`,
            animation: "spinDot 1s linear infinite",
            animationDelay: `${(i * 0.125).toFixed(3)}s`,
          }}
        />
      ))}

      <style>
        {`
          @keyframes spinDot {
            0% { opacity: 1; }
            100% { opacity: 0.2; }
          }
        `}
      </style>
    </div>
  );
};

export default LoaderComponent;
