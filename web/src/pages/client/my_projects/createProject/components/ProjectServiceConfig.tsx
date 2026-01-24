import React from "react";
import SectionHeader from "./SectionHeader";
import { InputField } from "@/shared/components/commonUI/inputs";
import CustomTable, {
  type Column,
} from "@/shared/components/commonUI/custom_table";
import { projectRateCards } from "@/dummy_data/client";
import { FaArrowRightLong } from "react-icons/fa6";
import Popup from "@/shared/components/Popup";
import { VscChromeClose } from "react-icons/vsc";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import type { ServiceConfig } from "../../types";
/**
 * ProjectServiceConfig
 *
 * Renders the service configuration section of the project creation form.
 * This section displays a compact rate-card table and allows the user to
 * view the full rate card in a popup. It also exposes read-only inputs for
 * engineer level and discount which are wired to the outer form.
 *
 * Behavior:
 * - Shows a small `CustomTable` with a subset of the rate card (no pagination).
 * - Clicking "View Full Rate Card" opens a `Popup` with a searchable rate card table.
 * - Integrates with the parent form through read-only `InputField` components
 *   (e.g. `engineerLevel`, `discount`) which should be controlled by the
 *   surrounding `FormProvider`.
 *
 * Notes:
 * - Uses dummy `projectRateCards` data for display. In production this should
 *   be replaced by API-driven data passed via props or fetched within the
 *   parent form.
 *
 * @component
 * @returns {JSX.Element} Service configuration UI including small rate card and popup
 */
export default function ProjectServiceConfig() {
  const [isOpen, setIsOpen] = React.useState(false);

  const columns: Column<ServiceConfig>[] = [
    { key: "service", label: "Service" },
    { key: "skill", label: "Skill" },
    { key: "sla", label: "SLA" },
    { key: "level", label: "Level" },
    { key: "country", label: "Country" },
    { key: "rate", label: "Rate" },
  ];

  return (
    <div>
      <SectionHeader title="Service Configuration" />

      <InputField
        disabled={true}
        name="engineerLevel"
        label="Engineer Level"
        required
        placeholder="Engineer Level"
      />
      <div className="h-full flex-1 overflow-y-auto my-6">
        <CustomTable<ServiceConfig>
          columns={columns}
          data={projectRateCards}
          initialPageSize={5}
          showPagination={false}
        />
        <div
          onClick={() => setIsOpen(true)}
          className="dark:text-teal-500 text-emerald-900 items-center gap-1 cursor-pointer mt-2 hover:underline font-semibold flex justify-end"
        >
          View Full Rate Card
          <FaArrowRightLong className="text-lg" />
        </div>
      </div>
      <InputField
        disabled={true}
        name="discount"
        label="Discount (%)"
        required
        placeholder="Discount"
      />

      <Popup
        open={isOpen}
        onClose={() => setIsOpen(false)}
        inputClassName="w-[35rem] bg-white dark:bg-gray-800 rounded-lg shadow-sm"
      >
        <div className="p-4">
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold text-emerald-900 dark:text-white">
              Rate Card
            </h3>
            <VscChromeClose
              className="cursor-pointer dark:text-white"
              onClick={() => setIsOpen(false)}
            />
          </div>
          <div>
            <SearchInput />
          </div>
          <div className="h-96 flex-1 mb-2">
            <CustomTable<ServiceConfig>
              columns={columns}
              data={projectRateCards}
              initialPageSize={10}
              showPagination={false}
            />
          </div>
        </div>
      </Popup>
    </div>
  );
}
