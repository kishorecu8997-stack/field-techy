

import { useLookupData, useClientGetRateCard } from "@/shared/apiServices/client/clientOpenApiService";
import { ENGAGEMENT_MODELS } from "@/dummy_data/jobFormOptions";
import { type PostAJobFieldsProps } from "../../../types";
import { useEffect, useState, useMemo } from "react";

interface BillSummaryProps {
    data: PostAJobFieldsProps;
    onConsentChange: (checked: boolean) => void;
    defaultConsent?: boolean;
}

export const BillSummary = ({ data, onConsentChange, defaultConsent = false }: BillSummaryProps) => {
    // Lookup Data
    const { data: countriesData } = useLookupData("countries");
    const { data: serviceCategoriesData } = useLookupData("serviceCategories");
    const { data: experienceLevelsData } = useLookupData("educationLevels");

    const countries = useMemo(() => countriesData?.map(c => ({ label: c.name, value: String(c.id) })) || [], [countriesData]);
    const serviceCategories = useMemo(() => serviceCategoriesData?.map(s => ({ label: s.name, value: String(s.id) })) || [], [serviceCategoriesData]);
    const experienceLevel = useMemo(() => experienceLevelsData?.map(e => ({ label: e.name, value: String(e.id) })) || [], [experienceLevelsData]);

    const { mutate: getRateCard } = useClientGetRateCard();
    const [ratePerWeek, setRatePerWeek] = useState<number>(0);

    useEffect(() => {
        if (
            data.serviceCategory &&
            data.experienceLevel &&
            data.engagementModel &&
            data.country
        ) {
            getRateCard(
                {
                    body: {
                        serviceCategoryId: Number(data.serviceCategory),
                        experienceLevelId: Number(data.experienceLevel),
                        engagementModelId: Number(data.engagementModel) || 1,
                        countryId: Number(data.country),
                    },
                    headers: {
                        authorization: "",
                    },
                },
                {
                    onSuccess: (response) => {
                        // @ts-ignore
                        setRatePerWeek(Number(response.rate));
                    },
                    onError: () => {
                        setRatePerWeek(0);
                    },
                }
            );
        } else {
            setRatePerWeek(0);
        }
    }, [
        data.serviceCategory,
        data.experienceLevel,
        data.engagementModel,
        data.country,
        getRateCard
    ]);

    const getLabel = (opts: { value: string; label: string }[], v?: string) =>
        opts.find((o) => o.value === v)?.label || "-";

    const formatDate = (value?: Date | null): string => {
        if (!value) return "-";
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return "-";
        return d.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getDuration = (start?: Date | null, end?: Date | null) => {
        if (!start || !end) return { days: 1, weeks: 1 };
        const s = new Date(start).getTime();
        const e = new Date(end).getTime();
        if (Number.isNaN(s) || Number.isNaN(e) || e < s)
            return { days: 1, weeks: 1 };
        const diffDays = Math.max(1, Math.ceil((e - s) / 86400000));
        const weeks = Math.max(1, Math.ceil(diffDays / 7));
        return { days: diffDays, weeks };
    };

    const duration = getDuration(data.startDate, data.endDate);
    const weeks = duration.weeks;
    const toolBudget = data.toolBudgetTotal || 0;
    const totalBill =
        ratePerWeek * weeks * Number(data.numberOfVacancy || 1) + toolBudget;
    const currency = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(totalBill);

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Service Category</span>
                    <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs">
                        {getLabel(serviceCategories, data.serviceCategory)}
                    </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Country</span>
                    <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs">
                        {getLabel(countries, data.country)}
                    </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Engineer Experience Level</span>
                    <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs">
                        {getLabel(experienceLevel, data.experienceLevel)}
                    </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Engagement Model</span>
                    <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs">
                        {getLabel(ENGAGEMENT_MODELS, data.engagementModel)}
                    </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Rate</span>
                    <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs">
                        ₹{ratePerWeek}
                    </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Duration</span>
                    <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs text-right">
                        {formatDate(data.startDate)} – {formatDate(data.endDate)} (
                        {duration.days < 7
                            ? `${duration.days} ${duration.days === 1 ? "day" : "days"}`
                            : `${weeks} ${weeks === 1 ? "week" : "weeks"}`}
                        )
                    </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Number of Vacancies</span>
                    <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs">
                        {data.numberOfVacancy || "-"}
                    </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Tools Cost</span>
                    <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs">
                        {data.toolBudgetTotal
                            ? `₹${data.toolBudgetTotal.toLocaleString("en-IN")}`
                            : "-"}
                    </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Service Charge</span>
                    <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs">
                        Free
                    </span>
                </div>
            </div>
            <hr className="border-gray-200 dark:border-gray-600" />
            <div className="flex items-center justify-between text-lg font-semibold text-gray-900 dark:text-gray-100 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 rounded px-3 py-2">
                <span>Total Bill</span>
                <span>{currency}</span>
            </div>

            <label className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 dark:bg-gray-700 dark:border-gray-600"
                    defaultChecked={defaultConsent}
                    onChange={(e) => {
                        onConsentChange(e.target.checked);
                    }}
                />
                <span>
                    By continuing, you agree to share this data within the selected
                    region
                </span>
            </label>
        </div>
    );
};

export default BillSummary;
