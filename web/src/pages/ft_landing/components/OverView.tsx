import { features } from "../type";

/**
 * Overview component for the homepage.
 *
 * @returns {JSX.Element} The rendered overview component.
 */
export default function Overview() {
  return (
    <section id="overview" className="bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-xl py-12 md:text-2xl font-semibold text-gray-800 dark:text-white">
            Modern and Intuitive Platform for Job <br /> Services and Work Flow
          </h2>
          <p className="mt-3 text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            From job creation to technician dispatch, on-site updates, and
            closure — every <br /> workflow becomes faster, clearer, and fully
            traceable.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="overflow-hidden transition-transform hover:scale-105"
            >
              <div className="relative overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.subtitle}
                  className="w-full h-full object-cover"
                />
                {/* Overlay Gradient */}
                <div
                  className="absolute inset-0 top-auto  m-4 rounded-3xl"
                  style={{
                    background:
                      "linear-gradient(to right, #95cc5c 50%, transparent 100%)",
                  }}
                >
                  <div className="p-4 text-black rounded-2xl">
                    <div className="text-lg lg:text-2xl font-bold">
                      {feature.title}
                    </div>
                    <div className="text-xs lg:text-sm mt-1">
                      {feature.subtitle}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
