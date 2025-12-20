import Header from "./components/Header";
import Banner from "./components/Banner";
import Overview from "./components/OverView";
import OptimizedExperience from "./components/OptimizedForEveryone";
import WorkFlow from "./components/WorkFlow";
import KeyFeatures from "./components/KeyFeatures";
import Testimonials from "./components/Testimonials";
import ServiceOperations from "./components/ServiceOperation";
import Footer from "./components/Footer";

/**
 * Landing page for the homepage.
 *
 * @returns {JSX.Element} The rendered landing page component.
 */
export default function FTLanding() {
  return (
    <div className="bg-white dark:bg-gray-800">
      <Header />
      <Banner />
      <Overview />
      <OptimizedExperience />
      <WorkFlow />
      <KeyFeatures />
      <Testimonials />
      <ServiceOperations />
      <Footer />
    </div>
  );
}
