import Header from "./components/Header";
import Banner from "./components/Banner";
import Overview from "./components/OverView";
import OptimizedExperience from "./components/OptimizedForEveryone";
import WorkFlow from "./components/WorkFlow";

export default function FTLanding() {
  return (
    <div className="relative">
      <Header />
      <Banner />
      <Overview />
      <OptimizedExperience />
      <WorkFlow />
    </div>
  );
}
