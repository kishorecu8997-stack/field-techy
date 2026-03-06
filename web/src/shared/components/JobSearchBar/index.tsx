import { absoluteUrls } from "@/config/urls";
import { useAppResolveSignupRegion } from "@/shared/apiServices/commonOpenApiService";
import { useCities, useCountries, useStates, type LookupItem } from "@/shared/hooks/useLookup";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FormContainer } from "../commonUI/inputs/FormContainer";
import { InlineDropdown, type DropdownId } from "./InlineDropdown";

// ─── Divider ─────────────────────────────────────────────────────────────────

const Divider = () => (
    <div className="h-6 w-px bg-gray-200 flex-shrink-0" />
);

// ─── Main Component ──────────────────────────────────────────────────────────

/**
 * A job search bar component with keyword input and cascading
 * Country → State → City location dropdowns sourced from the Lookup API.
 * Uses `useAppResolveSignupRegion` to scope countries to the resolved region.
 *
 * @component
 * @example
 * <JobSearchBar />
 */
export const JobSearchBar = () => {
    const methods = useForm({});
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const isEngineerRoute = location.pathname.startsWith("/engineer");

    // ── Region resolution ────────────────────────────────────────────────────
    const { data: signupRegion } = useAppResolveSignupRegion();
    const regionId = signupRegion?.regionId;

    // ── Search param values ──────────────────────────────────────────────────
    const [keyword, setKeyword] = useState(searchParams.get("q") ?? "");
    const [country, setCountry] = useState(searchParams.get("country") ?? "");
    const [state, setState] = useState(searchParams.get("state") ?? "");
    const [city, setCity] = useState(searchParams.get("city") ?? "");

    // ── Internal IDs for fetching ───────────────────────────────────────────
    const [countryId, setCountryId] = useState<string | number | null>(null);
    const [stateId, setStateId] = useState<string | number | null>(null);

    // ── API Hooks ────────────────────────────────────────────────────────────
    const { data: countries = [], isLoading: loadingCountries } = useCountries(regionId);
    const { data: states = [], isLoading: loadingStates } = useStates(countryId, { enabled: !!countryId });
    const { data: cities = [], isLoading: loadingCities } = useCities(stateId, { enabled: !!stateId });

    // ── Which dropdown is open ──────────────────────────────────────────────
    const [activeDropdown, setActiveDropdown] = useState<DropdownId>(null);

    const prevPathRef = useRef<string | null>(null);

    // ── Initial resolution of IDs from names in URL ─────────────────────────
    useEffect(() => {
        if (countries.length > 0 && country && !countryId) {
            const found = countries.find(c => c.name === country);
            if (found) setCountryId(found.id);
        }
    }, [countries, country, countryId]);

    useEffect(() => {
        if (states.length > 0 && state && !stateId) {
            const found = states.find(s => s.name === state);
            if (found) setStateId(found.id);
        }
    }, [states, state, stateId]);

    // ── Sync form values when params change ──────────────────────────────────
    useEffect(() => {
        setKeyword(searchParams.get("q") ?? "");
        setCountry(searchParams.get("country") ?? "");
        setState(searchParams.get("state") ?? "");
        setCity(searchParams.get("city") ?? "");
        setCountryId(null);
        setStateId(null);
    }, [searchParams]);

    const buildParams = (overrides: Record<string, string> = {}) => {
        const params = new URLSearchParams();
        const vals: Record<string, string> = {
            q: keyword,
            country,
            state,
            city,
            ...overrides,
        };
        Object.entries(vals).forEach(([k, v]) => {
            if (v) params.set(k, v);
        });
        return params.toString();
    };

    const navigateToResults = (overrides: Record<string, string> = {}) => {
        if (!prevPathRef.current) {
            prevPathRef.current = location.pathname;
        }

        const qs = buildParams(overrides);

        // If nothing is left in the query string, all filters have been cleared.
        // Send the user back to where they were before searching.
        if (!qs) {
            const fallback = isEngineerRoute
                ? absoluteUrls.engineer.home.my_jobs
                : absoluteUrls.client.home.my_jobs;
            // Go back to the page before search, or fall back to my-jobs
            const destination =
                prevPathRef.current && !prevPathRef.current.includes("search-result")
                    ? prevPathRef.current
                    : fallback;
            prevPathRef.current = null; // reset so next search records a fresh origin
            navigate(destination);
            return;
        }

        const base = isEngineerRoute
            ? absoluteUrls.engineer.home.search_result
            : absoluteUrls.client.home.search_result;
        navigate(`${base}?${qs}`);
    };

    // ── Keyword handler ──────────────────────────────────────────────────────

    const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setKeyword(val);
        // If keyword is deleted and no location filters are active, navigate back immediately
        if (!val.trim() && !country && !state && !city) {
            navigateToResults({ q: "" });
        }
    };

    // ── Dropdown toggle ──────────────────────────────────────────────────────

    const toggleDropdown = (id: DropdownId) => {
        setActiveDropdown(id);
    };

    const handleCountrySelect = (item: LookupItem) => {
        setCountry(item.name);
        setCountryId(item.id);
        setState("");
        setStateId(null);
        setCity("");
    };

    const handleStateSelect = (item: LookupItem) => {
        setState(item.name);
        setStateId(item.id);
        setCity("");
    };

    const handleCitySelect = (item: LookupItem) => {
        setCity(item.name);
    };

    // ── Clear handlers ───────────────────────────────────────────────────────

    const handleClearCountry = () => {
        setCountry("");
        setCountryId(null);
        setState("");
        setStateId(null);
        setCity("");
        navigateToResults({ country: "", state: "", city: "" });
    };

    const handleClearState = () => {
        setState("");
        setStateId(null);
        setCity("");
        navigateToResults({ state: "", city: "" });
    };

    const handleClearCity = () => {
        setCity("");
        navigateToResults({ city: "" });
    };

    const handleSearch = () => navigateToResults();

    return (
        <div className="relative w-full max-w-4xl mx-auto">
            <FormContainer onSubmit={handleSearch} methods={methods} className="w-full">
                <div
                    className="flex items-center w-full bg-white rounded-full border border-gray-200 shadow-md"
                    style={{ minHeight: "52px" }}
                >
                    <div className="relative flex-1 min-w-[150px] flex-grow flex items-center px-5 py-2">
                        <input
                            type="text"
                            value={keyword}
                            onChange={handleKeywordChange}
                            onFocus={() => {
                                setActiveDropdown(null);
                            }}
                            placeholder="Search Jobs.."
                            className="w-full bg-transparent outline-none border-none text-gray-800 placeholder-gray-400 text-sm"
                        />
                    </div>

                    <div className="hidden lg:flex items-center flex-shrink-0">
                        <Divider />
                        <InlineDropdown
                            id="country"
                            activeId={activeDropdown}
                            placeholder="Country"
                            value={country}
                            options={countries}
                            onToggle={toggleDropdown}
                            onSelect={handleCountrySelect}
                            onClear={handleClearCountry}
                            loading={loadingCountries}
                        />

                        <Divider />
                        <InlineDropdown
                            id="state"
                            activeId={activeDropdown}
                            placeholder="State"
                            value={state}
                            options={states}
                            onToggle={toggleDropdown}
                            onSelect={handleStateSelect}
                            onClear={handleClearState}
                            disabled={!countryId}
                            loading={loadingStates}
                        />

                        <Divider />
                        <InlineDropdown
                            id="city"
                            activeId={activeDropdown}
                            placeholder="City"
                            value={city}
                            options={cities}
                            onToggle={toggleDropdown}
                            onSelect={handleCitySelect}
                            onClear={handleClearCity}
                            disabled={!stateId}
                            loading={loadingCities}
                        />
                    </div>
                    <div className="pr-2 pl-2 flex-shrink-0">
                        <button
                            type="submit"
                            onClick={handleSearch}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm font-semibold px-3 sm:px-5 py-2.5 rounded-full transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                        >
                            <FaSearch className="text-sm" />
                            <span className="hidden sm:inline">Search</span>
                        </button>
                    </div>
                </div>
            </FormContainer>
        </div>
    );
};
