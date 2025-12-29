import Banner from "./components/Banner";
import Overview from "./components/OverView";
import OptimizedExperience from "./components/OptimizedForEveryone";
import WorkFlow from "./components/WorkFlow";
import KeyFeatures from "./components/KeyFeatures";
import Testimonials from "./components/Testimonials";
import ServiceOperations from "./components/ServiceOperation";

/**
 * Landing page for the homepage.
 *
 * @returns {JSX.Element} The rendered landing page component.
 */
export default function FTLanding() {
  return (
    <div>
      <Banner />
      <Overview />
      <OptimizedExperience />
      <WorkFlow />
      <KeyFeatures />
      <Testimonials />
      <ServiceOperations />
    </div>
  );
}
