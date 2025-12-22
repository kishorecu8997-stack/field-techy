import { Button } from "@/shared/components/commonUI/Buttons";
import { testimonials } from "../type";
import { FaStar } from "react-icons/fa";

/**
 * Testimonials component for the homepage.
 *
 * @returns {JSX.Element} The rendered testimonials component.
 */
export default function Testimonials() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-xl md:text-2xl font-semibold dark:text-white mb-4">
            Trusted By Industry Leaders
          </h2>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-gray-400">
            {[
              "TechCorp",
              "GlobalMSP",
              "NetServices",
              "HomeFix",
              "CyberSystems",
            ].map((company) => (
              <span key={company}>{company}</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-center">
          {[
            { label: "Engineers", value: "5k+" },
            { label: "Jobs Completed", value: "12k+" },
            { label: "SLA Compliance", value: "98%" },
            { label: "Countries Covered", value: "45+" },
          ].map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-2xl md:text-3xl font-bold text-[#024e51] dark:text-[#077a7e]">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="p-6 border border-[#d1d5dc] dark:border-[#4a5565] rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex dark:text-white justify-between items-center gap-3 mb-4">
                <div className="flex gap-2 items-center">
                  <img
                    alt="User"
                    src={testimonial.image}
                    className="w-8 h-8 rounded-full border-2 border-[#d1d5dc] dark:border-[#4a5565]"
                  />
                  <div>
                    <span className="font-medium">{testimonial.name}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      • {testimonial.date}
                    </span>
                    {testimonial.verified && (
                      <span className="ml-2 inline-block text-black px-2 py-0.5 text-xs bg-[#95cc5c] rounded">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`w-4 h-4 mr-1 ${
                        i < testimonial.rating
                          ? "text-[#ecba0b]"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 dark:text-white leading-relaxed">
                {testimonial.text}
                {testimonial.readMore && (
                  <Button variant="no_style" className="text-[#024e51] font-semibold cursor-pointer ml-1">
                    Read More
                  </Button>
                )}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center text-black">
          <Button
            variant="no_style"
            className="mt-6 cursor-pointer w-fit mx-auto px-6 py-2 bg-[#95cc5c] hover:bg-[#85b850] rounded-full transition-colors"
          >
            View All
          </Button>
        </div>
      </div>
    </div>
  );
}
