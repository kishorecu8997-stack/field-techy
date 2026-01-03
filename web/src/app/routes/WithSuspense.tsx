/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Suspense } from "react";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";

/**
 * Wraps a React lazy-loaded component with Suspense to show a fallback loader
 * while the component is being loaded.
 *
 * @param Component - The lazy-loaded React component.
 * @returns JSX.Element The component wrapped in a Suspense boundary with a loader.
 */
export const withSuspense = (
  Component: React.LazyExoticComponent<React.ComponentType<any>>
) => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-[80vh] w-full">
          <LoaderComponent />
        </div>
      }
    >
      <Component />
    </Suspense>
  );
};
