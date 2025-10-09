import React, { Suspense, type JSX } from "react";
import { createBrowserRouter } from "react-router-dom";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import { urls } from "@/config/urls";

const Login = React.lazy(() => import("@/pages/auth"));
const RootLayout = React.lazy(() => import("@/layout/RootLayout"));
const NotFound = React.lazy(() => import("@/shared/components/NotFound"));
const MyJobsPage = React.lazy(() => import("@/pages/my_job"));
const JobDetailsPage = React.lazy(
  () => import("@/pages/my_job/JobDetailsPage")
);
const SearchResult = React.lazy(() => import("@/pages/serch_result"));
const MyJobPrivacyPolicy = React.lazy(() => import("@/pages/privacy_policy/PolicyPage"));
const PolicyPage = React.lazy(() => import("@/pages/privacy_policy/PrivacyPolicy"));

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
    path: urls.login,
    element: withSuspense(Login),
  },
  {path:urls.privacy_policy, element: withSuspense(PolicyPage)},
  {
    path: urls.root,
    element: withSuspense(RootLayout),
    children: [
      // { path: urls.home.my_jobs, element: withSuspense(MyJobs) },
      { path: urls.home.my_jobs, element: withSuspense(MyJobsPage) },
      { path: `${urls.home.my_jobs}/:jobId`, element: withSuspense(JobDetailsPage) },
      { path: urls.home.search_result, element: withSuspense(SearchResult) },
      { path: urls.home.privacy_policy, element: withSuspense(MyJobPrivacyPolicy) },
    ],
  },
  {
    path: "*",
    element: withSuspense(NotFound),
  },
]);
