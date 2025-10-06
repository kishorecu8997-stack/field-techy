import React, { Suspense, type JSX } from "react";
import { createBrowserRouter } from "react-router-dom";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";

const Login = React.lazy(() => import("@/pages/auth"));
const RootLayout = React.lazy(() => import("@/layout/RootLayout"));
const NotFound = React.lazy(() => import("@/shared/components/NotFound"));
const MyJobsPage = React.lazy(() => import("@/pages/my_job/MyJobsPage"));
const JobDetailsPage = React.lazy(
  () => import("@/pages/my_job/JobDetailsPage")
);

/**
 * Wraps a React lazy-loaded component with Suspense to show a fallback loader
 * while the component is being loaded.
 *
 * @param {React.LazyExoticComponent<() => JSX.Element>} Component - The lazy-loaded React component.
 * @returns {JSX.Element} The component wrapped in a Suspense boundary with a loader.
 */
const withSuspense = (
  Component: React.LazyExoticComponent<() => JSX.Element>
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

/**
 * Application routes for react-router-dom using lazy-loaded components.
 * Each route element is wrapped with `withSuspense` for loading fallback.
 *
 * @type {import("react-router-dom").Router}
 */
export const routes = createBrowserRouter([
  {
    path: "/login",
    element: withSuspense(Login),
  },
  {
    path: "/",
    element: withSuspense(RootLayout),
    children: [
      // { path: urls.home.my_jobs, element: withSuspense(MyJobs) },
      { path: "my-jobs", element: withSuspense(MyJobsPage) },
      { path: "/my-jobs/:jobId", element: withSuspense(JobDetailsPage) },
    ],
  },
  {
    path: "*",
    element: withSuspense(NotFound),
  },
]);
