import { absoluteUrls } from "@/config/urls";
import usePostAJobStore, {
  CurrentLocation,
} from "@/shared/store/postAJobStore";
import { useNavigate } from "react-router-dom";
import JobPostDropdown from "./JobPostDropdown";
import type { PostOption } from "../types";

/**
 * TalentSection Component
 * A section for displaying a dropdown menu for selecting job posting options.
 * It includes a list of options for dedicated, dispatch, and scheduled job services.
 * @returns {JSX.Element} The rendered TalentSection component.
 */
export default function TalentSection() {
  const navigate = useNavigate();
  const { setCurrentLocation } = usePostAJobStore();

  const options: PostOption[] = [
    {
      label: "Full Time Job",
      value: CurrentLocation.fullTime,
      tooltip: "Hire for full-time roles with a dedicated form.",
      action: () => {
        navigate(absoluteUrls.client.home.post_a_job);
        setCurrentLocation(CurrentLocation.fullTime);
      },
    },
    {
      label: "On Demand Job",
      value: CurrentLocation.onDemand,
      tooltip: "Hire for on-demand roles with a dedicated form.",
      action: () => {
        navigate(absoluteUrls.client.home.post_a_job);
        setCurrentLocation(CurrentLocation.onDemand);
      },
    },
  ];

  return (
    <section className="bg-teal-900 text-white rounded-2xl p-8 w-full max-w-xl shadow-lg mt-4">
      <h2 className="text-xl font-semibold mb-2">Looking for Talent?</h2>
      <p className="text-sm opacity-90 mb-6">
        Post your job opportunity and effortlessly engage with skilled
        professionals!
      </p>

      <JobPostDropdown options={options} />
    </section>
  );
}
