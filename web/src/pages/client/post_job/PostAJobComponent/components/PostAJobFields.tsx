import { absoluteUrls } from "@/config/urls";
import { useLookupData } from "@/shared/apiServices/client/clientOpenApiService";
import { Button } from "@/shared/components/commonUI/Buttons";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "react-hook-form";
import JobDetailsSection from "./form_sections/JobDetailsSection";
import LocationSection from "./form_sections/LocationSection";
import SchedulingSection from "./form_sections/SchedulingSection";
import RequirementsSection from "./form_sections/RequirementsSection";
import RateCardSection from "./form_sections/RateCardSection";
import OtherDetailsSection from "./form_sections/OtherDetailsSection";

/*
 *  PostAJobFields
 *    - Displays a form to add post a job details
 * @returns {JSX.Element} The rendered PostAJobFields
 * @constructor
 */
const PostAJobFields = ({
  isDisable,
  rate,
}: {
  isDisable: boolean;
  rate: string;
}) => {
  const navigate = useNavigate();
  const { setValue, watch } = useFormContext();

  console.log(rate, "rate");

  const selectedCountry = watch("country");
  const selectedState = watch("state");

  const { data: countriesData } = useLookupData("countries");
  const { data: serviceCategoriesData } = useLookupData("serviceCategories");
  const { data: experienceLevelsData } = useLookupData("experienceLevels");
  const { data: engagementModelsData } = useLookupData("engagementModels");

  console.log(engagementModelsData, "engagementModelsData");
  const { data: skillsData } = useLookupData("skills");
  const { data: toolsData } = useLookupData("tools");
  const { data: statesData } = useLookupData("states", selectedCountry);
  const { data: citiesData } = useLookupData("cities", selectedState);
  const { data: workLocationsData } = useLookupData("workLocations");

  const countryOptions = useMemo(
    () =>
      countriesData?.map((c) => ({ label: c.name, value: String(c.id) })) || [],
    [countriesData],
  );

  const stateOptions = useMemo(
    () =>
      statesData?.map((s) => ({ label: s.name, value: String(s.id) })) || [],
    [statesData],
  );

  const cityOptions = useMemo(
    () =>
      citiesData?.map((c) => ({ label: c.name, value: String(c.id) })) || [],
    [citiesData],
  );

  const locationTypeOptions = useMemo(
    () =>
      workLocationsData?.map((w) => ({ label: w.name, value: String(w.id) })) ||
      [],
    [workLocationsData],
  );

  const serviceCategoryOptions = useMemo(
    () =>
      serviceCategoriesData?.map((s) => ({
        label: s.name,
        value: String(s.id),
      })) || [],
    [serviceCategoriesData],
  );

  const experienceLevelOptions = useMemo(
    () =>
      experienceLevelsData?.map((e) => ({
        label: e.name,
        value: String(e.id),
      })) || [],
    [experienceLevelsData],
  );
  const engagementModelOptions = useMemo(
    () =>
      engagementModelsData?.map((e) => ({
        label: e.name,
        value: String(e.id),
      })) || [],
    [engagementModelsData],
  );

  const skillOptions = useMemo(
    () =>
      skillsData?.map((s) => ({ label: s.name, value: String(s.id) })) || [],
    [skillsData],
  );

  const toolOptions = useMemo(
    () => toolsData?.map((t) => ({ label: t.name, value: String(t.id) })) || [],
    [toolsData],
  );

  useEffect(() => {
    setValue("state", "");
    setValue("city", "");
  }, [selectedCountry, setValue]);

  useEffect(() => {
    setValue("city", "");
  }, [selectedState, setValue]);

  return (
    <div className="flex gap-4 flex-row p-2">
      <div className="w-2/3 space-y-8 bg-white dark:bg-gray-900 rounded-lg p-4">
        <JobDetailsSection isDisable={isDisable} />
        <LocationSection
          isDisable={isDisable}
          countryOptions={countryOptions}
          stateOptions={stateOptions}
          cityOptions={cityOptions}
          locationTypeOptions={locationTypeOptions}
        />
        <SchedulingSection isDisable={isDisable} />
        <RequirementsSection
          isDisable={isDisable}
          skillOptions={skillOptions}
          toolOptions={toolOptions}
        />
        <RateCardSection
          isDisable={isDisable}
          serviceCategoryOptions={serviceCategoryOptions}
          experienceLevelOptions={experienceLevelOptions}
          engagmentModelOptions={engagementModelOptions}
          countryOptions={countryOptions}
          rate={rate}
        />
        <OtherDetailsSection isDisable={isDisable} />
        {!isDisable && (
          <div className="flex justify-end gap-2 mt-2">
            <Button
              isScrollToTop
              variant="outline"
              className="rounded-md"
              onClick={() => {
                navigate(absoluteUrls.client.home.my_jobs);
              }}
            >
              Cancel
            </Button>
            <Button isScrollToTop className="rounded-md" type="submit">
              Submit
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostAJobFields;
