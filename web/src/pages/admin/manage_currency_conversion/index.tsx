import { absoluteUrls } from "@/config/urls";
import { CurrencyConversionData } from "@/dummy_data/admin/currencyConversion";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import React from "react";
import { CiEdit } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import type { CurrencyConversionRow } from "./types";

/**
 * ManageRateCards Component
 *
 * Displays a searchable and interactive table of rate cards. Allows administrators to:
 * - View rate card details
 * - Toggle status (active/inactive)
 * - Edit or delete specific rate cards
 *
 * @component
 * @example
 * return (
 *   <ManageRateCards />
 * );
 *
 * @returns {JSX.Element} The rendered ManageRateCards component.
 */

const ManageCurrencyConversion: React.FC = () => {
  const navigate = useNavigate();

  const columns: Column<CurrencyConversionRow>[] = [
    {
      key: "id",
      label: "Sr.No.",
      renderCell: (row: CurrencyConversionRow) => (
        <div className="whitespace-nowrap">{row.id}</div>
      ),
    },
    { key: "country", label: "Country" },
    { key: "currencyPair", label: "Currency Pair" },
    { key: "exchangeRate", label: "Exchange Rates (Base: INR)" },
    { key: "lastUpdated", label: "Last Updated" },
    { key: "lastUpdatedBy", label: "Last Updated By" },

    {
      key: "action",
      label: "Actions",
      dataCellAlign: "center",
      renderCell: (row: CurrencyConversionRow) => (
        <div className="flex items-center gap-2">
          <div
            className="p-2 bg-blue-100 rounded-md cursor-pointer"
            onClick={() => {
              navigate(
                `${absoluteUrls.admin.home.edit_exchange_rate}/${row.id}`,
                { state: row },
              );
            }}
          >
            <CiEdit className="text-blue-600" />
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full h-full flex flex-col p-3 gap-3">
      <h1 className="font-semibold ">Currency Rates</h1>
      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-gray-700 rounded-md gap-2">
        <div className="flex justify-between">
          <SearchInput />
          <div className="inline-flex items-center bg-teal-100 text-black-900 font-medium rounded-md px-3 py-4 h-6 text-sm">
            Base Currency: INR - Indian Rupee
          </div>
        </div>
        <div className="h-full flex-1 overflow-y-auto ">
          <CustomTable<CurrencyConversionRow>
            columns={columns}
            data={CurrencyConversionData}
            initialPageSize={10}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageCurrencyConversion;
