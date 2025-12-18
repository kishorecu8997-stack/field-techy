import React from "react";
import { keyFeatures } from "../type";

export default function KeyFeatures() {
  return (
    <div className="min-h-screen dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-xl md:text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
            Key Features
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Field Techy streamlines the entire field service lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {keyFeatures.map((feature) => (
            <div
              key={feature.id}
              className={`relative transition-all duration-300 group`}
            >
              <img
                src={feature.image}
                alt={feature.title}
                className="w-full object-cover"
              />

              {/* Hover-only content for other cards */}
              {!feature.alwaysVisible && (
                <>
                  <div
                    className="absolute space-y-2 bg-[#f4f7f7] rounded-4xl z-10 p-12 rounded-br-[38%] inset-0 
                  flex flex-col top-0 justify-start opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <div className="bg-[#95cc5c] rounded-lg p-2 w-fit">
                      {React.createElement(feature.icon)}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                    <ul className="space-y-2">
                      {feature.items?.map((item, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="mr-2">•</span>
                          <ol>{item}</ol>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="absolute rounded-4xl rounded-br-[38%]"></div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
