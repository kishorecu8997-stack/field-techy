import { assetsConfig } from "@/assets";

export default function Banner() {
  return (
    <div className="bg-[#024e51] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="md:flex items-center gap-8">
          {/* Left Content */}
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
              Global field engineers on tap for <br /> every IT project.
            </h1>

            <p className="text-sm md:text-base text-[#cde1e2]">
              Streamline scheduling, dispatch, and on/off-site job execution.
              Field Techy connects engineers, businesses, and home clients with
              real-time tracking and paperless workflows.
            </p>

            <div className="flex text-sm sm:flex-row gap-4 pt-2">
              <div className="bg-[#95cc5c] cursor-pointer text-black px-6 py-2  rounded-full font-medium hover:bg-[#85b850] w-fit">
                Get Started
              </div>
              <div className="border cursor-pointer border-[#95cc5c] text-white px-6 py-2 rounded-full font-medium hover:bg-white hover:text-black w-fit">
                Book a Demo
              </div>
            </div>

            <div className="items-center gap-2 pt-4">
              <div className="flex -space-x-2">
                <img
                  alt="User"
                  src={assetsConfig.images.users.user}
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <img
                  src={assetsConfig.images.profile.defaultProfileImage}
                  alt="User"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <img
                  src={assetsConfig.images.users.user}
                  alt="User"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              </div>
              <div className="mt-4 text-[#cde1e2]">
                Trusted by
                <span className="font-semibold text-[#95cc5c] px-2">
                  2,000+
                </span>
                businesses
                <br /> and service teams
              </div>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="md:w-1/2 my-16 justify-items-end">
            <img
              src={assetsConfig.landing.ft_landing_banner}
              alt="FT banner"
              className=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}
