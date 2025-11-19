import { InfoGrid } from "@/shared/components/manage_job_components/infoCardComponent";

/**
 * RateCardDetails Component
 *
 * Displays a read-only summary of rate card information such as
 * rate type, client names, project, region, and country.
 *
 * Uses the `InfoGrid` component to render data in a responsive grid layout.
 *
 * @component
 * @returns {JSX.Element} The rendered RateCardDetails section.
 *
 * @example
 * // Example usage:
 * <RateCardDetails />
 */
export default function RateCardDetails() {
  const infoData = [
    { label: "Rate Card Type", value: "Client" },
    { label: "Client Names", value: "Client1, Client2" },
    { label: "Project", value: "Project1" },
    { label: "Region", value: "Region1" },
    { label: "Country", value: "Country1" },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm">
      <InfoGrid items={infoData} columns={3} />
    </div>
  );
}
