import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useFormContext } from "react-hook-form";
import type { EngineerFormData } from "../types";
import { StarIcon } from "lucide-react";
import ProfileImageWithProgress from "@/shared/components/ProfileImageProgress";
import RatingAndReviewTable from "./RatingReviewTable";
import type { AdminGetEngineerResponse } from "@/api";
/**
 * BasicInformation
 *
 * Renders the personal details section for an engineer inside the admin user-details view.
 * This read-only section displays profile image with completion progress, contact and
 * account metadata, wallet balance and earnings, registration and last-login dates,
 * and an average rating summary with a table of ratings/reviews below.
 *
 * Notes:
 * - This component consumes form context via `useFormContext` for consistency with
 *   other sections, but currently renders static/read-only values. In future it can
 *   be wired to real data from props or API calls.
 * - `ProfileImageWithProgress` expects an image URL and a completion percentage.
 * - `RatingAndReviewTable` renders the list of user reviews.
 *
 * @component
 * @returns {JSX.Element} Personal details and rating summary for an engineer
 */
export default function BasicInformation({
  engineer,
}: {
  engineer?: AdminGetEngineerResponse;
}) {
  const methods = useFormContext<EngineerFormData>();

  const name = methods.watch("name");
  const address = methods.watch("address");
  const phoneNumber = methods.watch("phoneNumber");
  const emailAddress = methods.watch("email");
  const profileImage = methods.watch("profileImage");

  const walletBalance =
    engineer?.walletBalance !== undefined && engineer?.walletBalance !== null
      ? String(engineer.walletBalance)
      : "N/A";

  const registrationDate = engineer?.registrationDate
    ? new Date(engineer.registrationDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";
  const kycStatus = engineer?.kycStatus ?? "N/A";
  const employmentStatus = engineer?.employmentStatus ?? "N/A";
  const employmentType = engineer?.employmentType ?? "N/A";
  const averageRating = engineer?.averageRating ?? 0;

  return (
    <div>
      <h1 className="font-bold">Personal Details</h1>
      <FormContainer
        methods={methods}
        className="flex flex-col gap-2 mt-2 px-2 pb-4 w-full"
      >
        <label className="block text-sm text-gray-500 mb-1">
          Profile Image
        </label>
        <ProfileImageWithProgress
          imageUrl={typeof profileImage === "string" ? profileImage : ""}
          completionPercent={60}
        />

        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-1">Name</label>
              <p className="font-semibold">{name || "N/A"}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-1">
                Address
              </label>
              <p className="font-semibold">{address || "N/A"}</p>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Wallet balance
              </label>
              <p className="font-semibold">{walletBalance}</p>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-1">
                Phone Number
              </label>
              <p className="font-semibold">{phoneNumber || "N/A"}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-1">
                Registration Date
              </label>
              <p className="font-semibold">{registrationDate}</p>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Employment Status
              </label>
              <p className="font-semibold">{employmentStatus}</p>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-1">
                Email Address
              </label>
              <p className="font-semibold">{emailAddress || "N/A"}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-1">
                KYC Status
              </label>
              <p className="font-semibold">{kycStatus}</p>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Employment Type
              </label>
              <p className="font-semibold">{employmentType}</p>
            </div>
          </div>
        </div>

        {/* Average Rating */}
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-2">Average Rating</h3>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(averageRating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-1">{averageRating} / 5</p>
        </div>

        <div className="border-b px-4 border-gray-200 my-4" />
        <RatingAndReviewTable />
      </FormContainer>
    </div>
  );
}
