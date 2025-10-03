import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const LandingCarouselPanel: React.FC = () => {
  const sections = [
    {
      title: "Discover Jobs That Fit Your Skills",
      description:
        "Find exciting jobs that match your skills and help you grow professionally.",
      image: "https://i.ibb.co/0b0m0sR/hero-image.png",
    },
    {
      title: "Boost Your Career",
      description:
        "Connect with top companies and opportunities to accelerate your growth.",
      image: "https://i.ibb.co/0b0m0sR/hero-image.png",
    },
    {
      title: "Work Remotely or Onsite",
      description:
        "Choose the work environment that suits you best and thrive in your role.",
      image: "https://i.ibb.co/0b0m0sR/hero-image.png",
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
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Slider {...settings} className="w-full">
        {sections.map((section, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-4 min-h-[300px]"
          >
            <span className="flex items-center justify-center">
              <img
                src={section.image}
                alt={section.title}
                className="rounded-xl shadow-lg mb-4 w-full max-w-xs "
              />
            </span>
            <h1 className="text-xl font-bold text-center">{section.title}</h1>
            <p className="text-center text-sm opacity-80">
              {section.description}
            </p>
          </div>
        ))}
      </Slider>
    </div>
  );
};
