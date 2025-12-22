import { useState } from "react";
import { steps } from "../type";
import { assetsConfig } from "@/assets";
import { FaRegBuilding } from "react-icons/fa";
import { PiSuitcaseSimpleLight } from "react-icons/pi";

type TabType = "corporate" | "engineer";

/**
 * EngineeredForSpeedSection component for the homepage.
 *
 * @returns {JSX.Element} The rendered engineered for speed section component.
 */
export default function EngineeredForSpeedSection() {
  const [activeTab, setActiveTab] = useState<TabType>("corporate");

  const currentSteps = steps[activeTab];

  return (
    <section className="py-12" id="how_it_works">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white">
            How it Works
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            From start to finish in three steps.
          </p>
        </div>

        {/* Content Grid */}
        <div className="flex flex-wrap gap-4">
          <div
            onClick={() => setActiveTab("corporate")}
            className={`px-6 py-3 gap-2 flex items-center rounded-t-4xl cursor-pointer font-medium whitespace-nowrap transition ${
              activeTab === "corporate"
                ? "bg-[#024e51] text-white border-b-4 border-[#95cc5c]"
                : "border border-[#d1d5dc] dark:border-[#4a5565] dark:bg-gray-800 text-gray-800 dark:text-white"
            }`}
          >
            <FaRegBuilding />
            How it works for Corporate
          </div>

          <div
            onClick={() => setActiveTab("engineer")}
            className={`px-6 gap-2 flex items-center py-3 rounded-t-4xl cursor-pointer font-medium whitespace-nowrap transition ${
              activeTab === "engineer"
                ? "bg-[#024e51] text-white border-b-4 border-[#95cc5c]"
                : "border border-[#d1d5dc] dark:border-[#4a5565] dark:bg-gray-800 text-gray-800 dark:text-white"
            }`}
          >
            <PiSuitcaseSimpleLight />
            How it works for Engineer
          </div>
        </div>
        <div className="grid md:flex">
          {/* Steps */}
          <div className="md:w-7/12 md:rounded-bl-4xl p-4">
            {currentSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={index}
                  className="mb-4 p-4 rounded-4xl border border-[#d1d5dc] dark:border-[#4a5565] shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-[#95cc5c] rounded-lg p-2">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <span className="bg-[#024e51] text-white text-xs px-2 py-1 rounded-full">
                      {step.step}
                    </span>
                  </div>
                  <div className="flex items-start mt-2 gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-800 dark:text-white">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Image Placeholder */}
          <div className="md:w-5/12 overflow-hidden shadow-lg md:rounded-e-4xl">
            <img
              src={assetsConfig.landing.job_platform.work_flow}
              alt="Workflow illustration"
              className="w-full h-full xl:h-[31rem] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
