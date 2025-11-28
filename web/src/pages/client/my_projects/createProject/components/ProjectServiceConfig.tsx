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

export default function ProjectServiceConfig() {
  const [isOpen, setIsOpen] = React.useState(false);

  const columns: Column<any>[] = [
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
        name="engineerLevel"
        label="Engineer Level"
        required
        placeholder="Engineer Level"
      />
      <div className="h-full flex-1 overflow-y-auto my-6">
        <CustomTable<any>
          columns={columns}
          data={projectRateCards}
          initialPageSize={5}
          showPagination={false}
        />
        <div
          onClick={() => setIsOpen(true)}
          className="text-emerald-900 items-center gap-1 cursor-pointer mt-2 hover:underline font-semibold flex justify-end"
        >
          View Full Rate Card
          <FaArrowRightLong className="text-lg" />
        </div>
      </div>
      <InputField
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
            <h3 className="font-semibold text-emerald-900">Rate Card</h3>
            <VscChromeClose
              className="cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
          </div>
          <div>
            <SearchInput />
          </div>
          <div className="h-96 flex-1 mb-2">
            <CustomTable<any>
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
