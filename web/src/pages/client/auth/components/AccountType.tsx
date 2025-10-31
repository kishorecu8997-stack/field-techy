import { assetsConfig } from "@/assets";
import { absoluteUrls } from "@/config/urls";
import { useLocation, useNavigate } from "react-router-dom";

export default function ClientAccountType() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSelectType = (path: string) => {
    navigate(path, {
      state: location.state, //Forward the state from OTP step
    });
  };

  return (
    <div className="flex items-center justify-center max-w-lg">
      <div className="p-10 w-full">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-8">
            <img
              src={assetsConfig.logos.companyLogo}
              alt="logo"
              className="h-20 w-24"
            />
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-semibold">Setup Profile</h2>
            <p className="text-lg">Choose your account type</p>
          </div>
          <div className="flex gap-8 mt-8 justify-center">
            <div
              onClick={() =>
                handleSelectType(
                  `${absoluteUrls.client.auth.profile_setup}/corporate`
                )
              }
              className="border font-semibold cursor-pointer rounded-xl w-36 h-36 p-4 border-teal-700 flex flex-col items-center justify-center"
            >
              <img
                src={assetsConfig.icons.suitcase}
                alt="suitcase"
                className="mb-2"
              />
              CORPORATE CLIENT
            </div>

            <div
              onClick={() =>
                handleSelectType(
                  `${absoluteUrls.client.auth.profile_setup}/home`
                )
              }
              className="border font-semibold cursor-pointer rounded-xl w-36 h-36 p-4 border-teal-700 flex flex-col items-center justify-center text-center"
            >
              <img
                src={assetsConfig.icons.people}
                alt="people"
                className="mb-2"
              />
              HOME CLIENT
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
