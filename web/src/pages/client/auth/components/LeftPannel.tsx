// src/components/LeftPanel.tsx
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { assetsConfig } from "@/assets";

/**
 * Left Panel component with a carousel showcasing different sections/features.
 * Displays rotating slides with titles, descriptions, and images to highlight
 * platform benefits and features for users.
 *
 * @component
 * @example
 * return (
 *   <LeftPanel />
 * )
 *
 * @returns {JSX.Element} The rendered Left Panel carousel component
 */
const LeftPanel: React.FC = () => {
  const sections = [
    {
      title: "Verified Clients Secure Payments.",
      description:
        "Find exciting jobs that match your skills and help you grow professionally.",
      image: assetsConfig.images.left_panel_image.securePayments,
    },
    {
      title: "Discover Jobs That Fit Your Skills",
      description:
        "Find exciting jobs that match your skills and help you grow professionally.",
      image: assetsConfig.images.left_panel_image.skillsMatching,
    },
    {
      title: "Manage & track your live work",
      description:
        "Find exciting jobs that match your skills and help you grow professionally.",
      image: assetsConfig.images.left_panel_image.workTracking,
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    fade: true,
  };

  return (
    <div className="h-screen flex flex-col text-white">
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-6 md:p-8 lg:p-12">
        <Slider {...settings} className="w-full">
          {sections.map((section, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-2 min-h-[150px] md:min-h-[200px]"
            >
              <span className="items-center justify-center hidden md:block pb-8 bg-blend-lighten">
                <img
                  src={section.image}
                  alt={section.title}
                  className="rounded-xl shadow-lg w-full max-h-90 object-contain items-center"
                  loading="lazy"
                />
              </span>

              <div className="flex flex-col items-center text-center w-full">
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold mb-2">
                  {section.title}
                </h1>
                <p className="text-sm md:text-base opacity-80 text-center max-w-md">
                  {section.description}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default LeftPanel;
