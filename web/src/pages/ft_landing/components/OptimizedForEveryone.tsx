import { Link } from "react-router-dom";
import { experiences } from "../type";

/**
 * OptimizedExperience component for the homepage.
 *
 * @returns {JSX.Element} The rendered optimized experience component.
 */
export default function OptimizedExperience() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-semibold text-center text-gray-800 dark:text-white mb-8">
          Optimized Experiences For Everyone
        </h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-4xl border border-[#f0f0f0] overflow-hidden transition-transform hover:scale-105"
            >
              <div className="relative h-48 md:h-56 overflow-hidden">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-fill"
                />
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-8/12">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {exp.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      {exp.description}
                    </p>
                  </div>
                  <img src={exp.icon} alt={exp.title} className="w-8 h-8" />
                </div>

                <div className="bg-[#95cc5c] text-sm cursor-pointer text-black px-6 py-2 rounded-full font-medium hover:bg-[#85b850] w-fit">
                  <Link target="_blank" to={exp.link}>
                    Try Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
