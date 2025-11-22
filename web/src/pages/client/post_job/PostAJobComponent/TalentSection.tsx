import { absoluteUrls } from "@/config/urls";
import usePostAJobStore, {
  CurrentLocation,
} from "@/shared/store/postAJobStore";
import { useNavigate } from "react-router-dom";
import JobPostDropdown from "./JobPostDropdown";

export interface PostOption {
  label: string;
  value: string | number;
  action?: () => void;
}

export default function TalentSection() {
  const navigate = useNavigate();
  const { setCurrentLocation } = usePostAJobStore();

  const options: PostOption[] = [
    {
      label: "Dedicated Job Service",
      value: CurrentLocation.dedicated,
      action: () => {
        navigate(absoluteUrls.client.home.post_a_job);
        setCurrentLocation(CurrentLocation.dedicated);
      },
    },
    {
      label: "Dispatch Job Service",
      value: CurrentLocation.dispatch,
      action: () => {
        navigate(absoluteUrls.client.home.post_a_job);
        setCurrentLocation(CurrentLocation.dispatch);
      },
    },
    {
      label: "Scheduled Job Service",
      value: CurrentLocation.scheduled,
      action: () => {
        navigate(absoluteUrls.client.home.post_a_job);
        setCurrentLocation(CurrentLocation.scheduled);
      },
    },
  ];

  return (
    <section className="bg-teal-900 text-white rounded-2xl p-8 w-full max-w-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-2">Looking for Talent?</h2>
      <p className="text-sm opacity-90 mb-6">
        Post your job opportunity and effortlessly engage with skilled
        professionals!
      </p>

      <JobPostDropdown options={options} />
    </section>
  );
}
