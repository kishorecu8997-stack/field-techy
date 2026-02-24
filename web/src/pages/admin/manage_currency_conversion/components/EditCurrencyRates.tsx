import { absoluteUrls } from "@/config/urls";
import { CurrencyConversionData } from "@/dummy_data/admin/currencyConversion";
import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { usePopupStore } from "@/shared/store/popupStore";
import React from "react";
import { useForm } from "react-hook-form";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import type { CurrencyConversionRow } from "../types";

type FormValues = {
  country: string;
  currencyPair: string;
  exchangeRate: string;
};

/**
 * EditCurrencyRates
 *
 * Form page used to edit an existing currency exchange rate.
 * Retrieves row data from router state or fallback dummy data,
 * allows updating the exchange rate, and confirms the action
 * through a popup before saving.
 *
 * @component
 * @returns {JSX.Element} Edit currency exchange rate form UI
 */

const EditCurrencyRates: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { showPopup } = usePopupStore();

  const stateRow = location.state as CurrencyConversionRow | null;
  const id = params.id;

  const row: CurrencyConversionRow = stateRow ??
    CurrencyConversionData.find((r) => r.id === id) ?? {
      id: "sample",
      country: "Afghanistan",
      currencyPair: "AFN → INR",
      baseCurrency: "INR",
      exchangeRate: 1.02,
      lastUpdated: "—",
      lastUpdatedBy: "—",
    };

  const methods = useForm<FormValues>({
    defaultValues: {
      country: row.country,
      currencyPair: row.currencyPair,
      exchangeRate: String(row.exchangeRate ?? ""),
    },
  });

  const handleSaveConfirmation = async (data: FormValues) => {
    await showPopup({
      title: "Exchange Rate",
      body: "Are you sure you want to save this exchange rate?",
      actionButtons: [
        { label: "Cancel", value: null, variant: "outline" },
        {
          label: "Submit",
          value: "submit",
          variant: "primary",
          action: async (close) => {
            console.log("Saving exchange rate:", { id: row.id, ...data });
            toast.success("Exchange rate updated successfully!");
            navigate(absoluteUrls.admin.home.manage_currency_conversion);
            close(true);
          },
        },
      ],
    });
  };

  const onSubmit = (data: FormValues) => {
    handleSaveConfirmation(data);
  };

  const fromCurrency = row.currencyPair.split("→")[0]?.trim() || "currency";

  return (
    <div className="w-full h-full flex flex-col p-3 gap-3">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-neutral-900 dark:text-neutral-100">
          Edit Exchange Rate
        </h1>
        <Button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-neutral-900 text-neutral-200 hover:bg-neutral-800"
        >
          Back
        </Button>
      </div>

      <FormContainer
        methods={methods}
        onSubmit={onSubmit}
        className="w-full flex-1 overflow-y-auto"
      >
        <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-gray-700 rounded-md gap-2">
          <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden flex flex-col flex-1 min-h-[260px]">
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <InputField
                  name="country"
                  label="Country"
                  disabled
                  containerClassName="flex flex-col gap-2"
                  inputClassName="w-full rounded-md border border-gray-300 py-3 px-4 text-base"
                />

                <InputField
                  name="currencyPair"
                  label="Currency Pair"
                  disabled
                  containerClassName="flex flex-col gap-2"
                  inputClassName="w-full rounded-md border border-gray-300 py-3 px-4 text-base"
                />

                <div className="flex flex-col gap-2">
                  <InputField
                    name="exchangeRate"
                    label={`Exchange Rate (Base: ${row.baseCurrency})`}
                    type="text"
                    required="Exchange rate is required"
                    allowedCharacters="numbers-dot"
                    containerClassName="flex flex-col gap-2"
                    inputClassName="w-full rounded-md border border-gray-300 py-3 px-4 text-base"
                  />
                  <div className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-200">
                    <AiOutlineInfoCircle className="mt-0.5 text-teal-700" />
                    <span>Enter the INR value for 1 {fromCurrency}.</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-300 my-4 w-full" />
            </div>
            <div className="flex justify-end pr-4">
              <Button
                type="submit"
                className="bg-teal-900 hover:bg-teal-950 px-8 py-3"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </FormContainer>
    </div>
  );
};

export default EditCurrencyRates;
