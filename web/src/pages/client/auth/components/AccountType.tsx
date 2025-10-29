import { assetsConfig } from "@/assets";
import { absoluteUrls } from "@/config/urls";
import { useNavigate } from "react-router-dom";

export default function ClientAccountType() {
  const navigate = useNavigate();

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
          <div className="flex gap-8 mt-8">
            <div
              className="border font-semibold cursor-pointer rounded-xl w-36 h-36 p-4 border-teal-700"
              onClick={() =>
                navigate(`${absoluteUrls.client.auth.profile_setup}/role?:1`)
              }
            >
              <img
                src={assetsConfig.icons.suitcase}
                alt="suitcase"
                className="text-center mx-auto mb-2"
              />
              CORPORATE CLIENT
            </div>
            <div
              className="border font-semibold cursor-pointer rounded-xl w-36 h-36 p-4 border-teal-700"
              onClick={() =>
                navigate(`${absoluteUrls.client.auth.profile_setup}/role?:2`)
              }
            >
              <img
                src={assetsConfig.icons.people}
                alt="people"
                className="text-center mb-1 mx-auto"
              />
              HOME <br /> CLIENT
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
