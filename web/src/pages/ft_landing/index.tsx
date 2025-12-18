import Header from "./components/Header";
import Banner from "./components/Banner";
import Overview from "./components/OverView";
import OptimizedExperience from "./components/OptimizedForEveryone";
import WorkFlow from "./components/WorkFlow";
import KeyFeatures from "./components/KeyFeatures";
import Testimonials from "./components/Testimonials";
import ServiceOperations from "./components/ServiceOperation";
import Footer from "./components/Footer";

export default function FTLanding() {
  return (
    <div className="relative">
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
