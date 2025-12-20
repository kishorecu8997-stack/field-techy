import { assetsConfig } from "@/assets";

/**
 * Footer component for the homepage.
 *
 * @returns {JSX.Element} The rendered footer component.
 */
export default function Footer() {
  return (
    <section className="mt-16 bg-[#024e51] text-white">
      <div className="container mx-auto px-4">
        <div className="text-center py-6">
          <img
            src={assetsConfig.logos.company_logo_white}
            alt="logo"
            className="mt-12 mx-auto"
          />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold leading-tight">
            Ready to Transform Your Field <br />
            Operations?
          </h2>
        </div>

        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="text-sm md:text-base opacity-80 leading-relaxed">
            Join leading teams using Field Techy to automate scheduling, track
            technicians in real time, and deliver faster, more reliable
            on/off-site services.
          </p>
        </div>

        <div className="text-center">
          <div className="px-6 cursor-pointer w-fit mx-auto py-2 border border-[#95cc5c] text-white rounded-full hover:bg-[#95cc5c] hover:text-black transition-colors text-sm font-medium">
            Book a Demo
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-4 pb-3 bg-[#95cc5c] text-center text-xs text-black">
        ©2025 FieldTechy | Privacy Policy | Terms
      </div>
    </section>
  );
}
