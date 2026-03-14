import { absoluteUrls } from "@/config/urls";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import { useAdminExchangeRates } from "@/shared/apiServices/admin/adminOpenApiService";
import React from "react";
import { CiEdit } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import type { CurrencyConversionRow } from "./types";
import { Button } from "@headlessui/react";
import { useState } from "react";

/**
 * Displays currency exchange rates in a searchable table
 * with navigation to edit individual rates.
 * @returns {JSX.Element}
 */

const ManageCurrencyConversion: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data: exchangeRatesData, isLoading } = useAdminExchangeRates({
    search: search || undefined,
  });

  const tableData = exchangeRatesData?.data ?? [];

  const columns: Column<CurrencyConversionRow>[] = [
    {
      key: "id",
      label: "Sr.No.",
      renderCell: (row: CurrencyConversionRow) => (
        <div className="whitespace-nowrap">{row.id}</div>
      ),
    },
    { key: "countryName", label: "Country" },
    { key: "currencyPair", label: "Currency Pair" },
    {
      key: "rate",
      label: "Exchange Rates",
      renderCell: (row: CurrencyConversionRow) => {
        const parsedRate = Number(row.rate);
        const displayRate = Number.isFinite(parsedRate)
          ? parsedRate.toFixed(4)
          : "-";
        return <div className="whitespace-nowrap">{displayRate}</div>;
      },
    },
    {
      key: "lastUpdated",
      label: "Last Updated",
      renderCell: (row: CurrencyConversionRow) => (
        <div className="whitespace-nowrap">
          {row.lastUpdated
            ? new Date(row.lastUpdated).toLocaleDateString()
            : "-"}
        </div>
      ),
    },
    { key: "lastUpdatedBy", label: "Last Updated By" },

    {
      key: "action",
      label: "Actions",
      dataCellAlign: "center",
      renderCell: (row: CurrencyConversionRow) => (
        <div className="flex items-center gap-2">
          <Button
            className="p-2 bg-blue-100 rounded-md cursor-pointer"
            onClick={() => {
              navigate(
                `${absoluteUrls.admin.home.edit_exchange_rate}/${row.currencyId}`,
                { state: row },
              );
            }}
          >
            <CiEdit className="text-blue-600" />
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full h-full flex flex-col p-3 gap-3">
      <h1 className="font-semibold">Currency Rates</h1>
      <div className="p-4 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-gray-700 rounded-md gap-2">
        <div className="flex justify-between">
          <SearchInput value={search} onChange={setSearch} />
          <div className="inline-flex items-center bg-teal-100 text-black font-medium rounded-md px-3 py-4 h-6 text-sm">
            Base Currency: INR - Indian Rupee
          </div>
        </div>
        <div className="h-full flex-1 overflow-y-auto">
          <CustomTable<CurrencyConversionRow>
            columns={columns}
            data={tableData}
            initialPageSize={10}
            loading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageCurrencyConversion;
