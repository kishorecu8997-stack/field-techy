import { repeatByOptions } from "@/dummy_data/client";
import { InputField } from "@/shared/components/commonUI/inputs";
import CustomTimePicker from "@/shared/components/commonUI/inputs/CustomTimePicker";
import { DatePickerInput } from "@/shared/components/commonUI/inputs/DatePickerInput";
import { RadioField } from "@/shared/components/commonUI/inputs/RadioField";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import usePostAJobStore, {
  CurrentLocation,
} from "@/shared/store/postAJobStore";
import { getDurationString, getMinTentativeEndDate } from "@/utils";
import { getMonthList, getOrdinalList } from "@/utils/scheduleFuntions";
import { validateDateRange } from "@/utils/validate";
import {
  validateCurrentOrFutureDate,
} from "../../../post_job/Validates";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  OccurrenceEndType,
  OccurrenceFields,
  RepeatByFields,
} from "../../types";
import SectionHeader from "../SectionHeader";
import CheckboxSelector from "@/shared/components/CheckboxSelector";

/*
 *  Scheduling
 *    - Displays a form to add scheduling
 * @returns {JSX.Element} The rendered Scheduling
 * @constructor
 */
const SchedulingPage = ({ isDisable }: { isDisable: boolean }) => {
  const ctx = useFormContext();
  const watchOccurrence = ctx.watch("jobOccurrence");
  const watchOccurrenceEndType = ctx.watch("occurrenceEndType");
  const watchRepeatedBy = ctx.watch("repeatedBy");
  const { currentLocation } = usePostAJobStore();

  const tentativeStartDate = ctx.watch("tentativeStartDate");
  const tentativeEndDate = ctx.watch("tentativeEndDate");
  const applicationEndDate = ctx.watch("applicationEndDate");
  const startTime = ctx.watch("startTime");
  const endTime = ctx.watch("endTime");
  const startDate = ctx.watch("startDate");
  const endDate = ctx.watch("endDate");

  const minTentativeEndDate = getMinTentativeEndDate(
    applicationEndDate,
    tentativeStartDate
  );

  useEffect(() => {
    if (tentativeStartDate && tentativeEndDate) {
      const duration = getDurationString({
        startDateStr: tentativeStartDate,
        endDateStr: tentativeEndDate,
      });
      ctx.setValue("jobDuration", duration);
    }
  }, [tentativeStartDate, tentativeEndDate]);

  useEffect(() => {
    if (startDate && endDate && startTime && endTime) {
      const duration = getDurationString({
        startDateStr: startDate,
        endDateStr: endDate,
        startTime: startTime,
        endTime: endTime,
      });
      ctx.setValue("estimatedDuration", duration);
    }
  }, [startDate, startTime, endDate, endTime]);

  return (
    <>
      <SectionHeader title="Scheduling" />
      {currentLocation === CurrentLocation.dedicated ? (
        <div className="w-full space-y-2">
          <div className="flex flex-row w-full gap-4 items-center">
            <div className="relative w-full">
              <Controller
                name="applicationEndDate"
                rules={{
                  validate: (value) =>
                    validateDateRange(
                      value,
                      ctx.getValues("applicationEndDate")
                    ),
                }}
                control={ctx.control}
                render={({ field }) => (
                  <>
                    <DatePickerInput
                      disabled={isDisable}
                      label=" Application End Date"
                      placeholder="Select Application End date"
                      {...field}
                      required
                      minDate={new Date(new Date().setHours(0, 0, 0, 0))} 
                      maxDate={tentativeStartDate ? tentativeStartDate : null}
                       rules={{
                  validate: (value) => validateCurrentOrFutureDate(value),
                }}
                    />
                  </>
                )}
              />
            </div>
            <div className="w-full">
              <CustomTimePicker
                disabled={isDisable}
                label="Application End Time"
                name="applicationEndTime"
                required
              />
            </div>
          </div>
          <div className="flex flex-row w-full gap-4 items-center">
            <div className="relative w-full">
              <Controller
                name="tentativeStartDate"
                rules={{
                  validate: (value) =>
                    validateDateRange(
                      value,
                      ctx.getValues("tentativeStartDate")
                    ),
                }}
                control={ctx.control}
                render={({ field }) => (
                  <>
                    <DatePickerInput
                      disabled={isDisable}
                      label="Tentative Start Date"
                      placeholder="Select Tentative start date"
                      {...field}
                      required
                      minDate={applicationEndDate ? applicationEndDate : null}
                      maxDate={tentativeEndDate ? tentativeEndDate : null}
                      rules={{
                  validate: (value) => validateCurrentOrFutureDate(value),
                }}
                    />
                  </>
                )}
              />
            </div>
            <div className="relative w-full">
              <Controller
                name="tentativeEndDate"
                rules={{
                  validate: (value) =>
                    validateDateRange(value, ctx.getValues("tentativeEndDate")),
                  
                }}
                control={ctx.control}
                render={({ field }) => (
                  <>
                    <DatePickerInput
                      disabled={isDisable}
                      label="Tentative End Date"
                      placeholder="Select Tentative End date"
                      {...field}
                      minDate={minTentativeEndDate}
                      required
                    />
                  </>
                )}
              />
            </div>
          </div>

          <InputField
            disabled={true}
            name={"jobDuration"}
            required
            label={"Job Duration"}
            placeholder={"Enter Job Duration"}
          />
        </div>
      ) : currentLocation === CurrentLocation.scheduled ? (
        <div className="w-full space-y-2">
          <RadioField
            disabled={isDisable}
            required
            label="Job Occurrence Type"
            name="jobOccurrence"
            direction="horizontal"
            options={[
              { label: "Repeat", value: OccurrenceFields.repeat },
              { label: "Custom", value: OccurrenceFields.custom },
            ]}
          />
          {watchOccurrence === OccurrenceFields.repeat ? (
            <>
              <SelectField
                disabled={isDisable}
                name="repeatedBy"
                label="Repeated By"
                options={repeatByOptions}
                required
              />
              {watchRepeatedBy === RepeatByFields.week ? (
                <>
                  <CheckboxSelector
                    disabled={isDisable}
                    name="repeatOn"
                    label="Repeat On (Days)"
                    required
                    options={[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ]}
                  />
                  <div className="relative w-full">
                    <Controller
                      name="startDate"
                      rules={{
                        validate: (value) =>
                          validateDateRange(value, ctx.getValues("startDate")),
                      }}
                      control={ctx.control}
                      render={({ field }) => (
                        <>
                          <DatePickerInput
                            disabled={isDisable}
                            label="Start Date"
                            placeholder="Select start date"
                            {...field}
                            required
                          />
                        </>
                      )}
                    />
                  </div>
                  <div className="flex flex-row w-full gap-2 items-center">
                    <div className="w-full">
                      <CustomTimePicker
                        name="startTime"
                        required
                        label="Start Time"
                        maxTime={endTime}
                        disabled={isDisable}
                      />
                    </div>
                    <div className="w-full">
                      <CustomTimePicker
                        name="endTime"
                        required
                        label="End Time"
                        minTime={startTime}
                        disabled={isDisable}
                      />
                    </div>
                  </div>
                </>
              ) : watchRepeatedBy === RepeatByFields.month ? (
                <div className="mt-2">
                  <SelectField
                    disabled={isDisable}
                    label="Repeat On (Date of month)"
                    name="repeatedByMonth"
                    required
                    options={getOrdinalList()}
                  />
                </div>
              ) : (
                watchRepeatedBy === RepeatByFields.year && (
                  <div className="flex flex-row w-full gap-4 items-center mt-2">
                    <div className="w-full">
                      <SelectField
                        disabled={isDisable}
                        label="Repeat Year"
                        name="repeatedByYear"
                        required
                        options={getMonthList()}
                      />
                    </div>
                    <div className="w-full">
                      <SelectField
                        disabled={isDisable}
                        label="Repeat On (Date of month)"
                        name="repeatedByMonth"
                        required
                        options={getOrdinalList()}
                      />
                    </div>
                  </div>
                )
              )}
              <RadioField
                disabled={isDisable}
                required
                label="Job Occurrence End Type"
                name="occurrenceEndType"
                direction="horizontal"
                options={[
                  {
                    label: "On particular date",
                    value: OccurrenceEndType.onDate,
                  },
                  {
                    label: "After particular date",
                    value: OccurrenceEndType.afterDate,
                  },
                ]}
              />
              {watchOccurrenceEndType === OccurrenceEndType.onDate ? (
                <div className="relative w-full">
                  <Controller
                    name="JobOccurrenceEndDate"
                    rules={{
                      validate: (value) =>
                        validateDateRange(
                          value,
                          ctx.getValues("JobOccurrenceEndDate")
                        ),
                    }}
                    control={ctx.control}
                    render={({ field }) => (
                      <>
                        <DatePickerInput
                          disabled={isDisable}
                          label="Job Occurrence End Date"
                          placeholder="Select Job Occurrence end date"
                          {...field}
                          required
                        />
                      </>
                    )}
                  />
                </div>
              ) : (
                <InputField
                  disabled={isDisable}
                  required
                  name="after"
                  label="After (Number of Occurrences)"
                  placeholder="Enter number of occurrences"
                  type="number"
                />
              )}
            </>
          ) : (
            watchOccurrence === OccurrenceFields.custom && (
              <div className="w-full space-y-2">
                <div className="flex flex-col w-full ">
                  <div className="flex flex-row w-full gap-2 items-center">
                    <div className="relative w-full">
                      <Controller
                        disabled={isDisable}
                        name="startDate"
                        rules={{
                          validate: (value) =>
                            validateDateRange(
                              value,
                              ctx.getValues("startDate")
                            ),
                        }}
                        control={ctx.control}
                        render={({ field }) => (
                          <>
                            <DatePickerInput
                              disabled={isDisable}
                              label="Start Date"
                              placeholder="Select start date"
                              {...field}
                              required
                            />
                          </>
                        )}
                      />
                    </div>
                    <div className="w-full">
                      <CustomTimePicker
                        label="Start Time"
                        name="startTime"
                        required
                        disabled={isDisable}
                      />
                    </div>
                  </div>
                  <div className="flex flex-row w-full gap-2 items-center">
                    <div className="relative w-full">
                      <Controller
                        name="endDate"
                        rules={{
                          validate: (value) =>
                            validateDateRange(value, ctx.getValues("endDate")),
                        }}
                        control={ctx.control}
                        render={({ field }) => (
                          <>
                            <DatePickerInput
                              disabled={isDisable}
                              label="End Date"
                              placeholder="Select End date"
                              {...field}
                              required
                            />
                          </>
                        )}
                      />
                    </div>
                    <div className="w-full">
                      <CustomTimePicker
                        label="End Time"
                        name="endTime"
                        required
                        disabled={isDisable}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        currentLocation === CurrentLocation.dispatch && (
          <>
            <div className="w-full space-y-2">
              <div className="flex flex-col w-full ">
                <div className="flex flex-row w-full gap-2 items-center">
                  <div className="relative w-full">
                    <Controller
                      name="startDate"
                      rules={{
                        validate: (value) =>
                          validateDateRange(value, ctx.getValues("startDate")),
                      }}
                      control={ctx.control}
                      disabled={isDisable}
                      render={({ field }) => (
                        <>
                          <DatePickerInput
                            disabled={isDisable}
                            label="Start Date"
                            placeholder="Select start date"
                            {...field}
                            required
                            maxDate={endDate ? endDate : null}
                          />
                        </>
                      )}
                    />
                  </div>
                  <div className="w-full">
                    <CustomTimePicker
                      label="Start Time"
                      name="startTime"
                      required
                      maxTime={endTime}
                      disabled={isDisable}
                    />
                  </div>
                </div>
                <div className="flex flex-row w-full gap-2 items-center">
                  <div className="relative w-full">
                    <Controller
                      name="endDate"
                      rules={{
                        validate: (value) =>
                          validateDateRange(value, ctx.getValues("endDate")),
                      }}
                      control={ctx.control}
                      render={({ field }) => (
                        <>
                          <DatePickerInput
                            label="End Date"
                            placeholder="Select End date"
                            {...field}
                            required
                            minDate={startDate ? startDate : null}
                            disabled={isDisable}
                          />
                        </>
                      )}
                    />
                  </div>
                  <div className="w-full">
                    <CustomTimePicker
                      label="End Time"
                      name="endTime"
                      required
                      minTime={startTime}
                      disabled={isDisable}
                    />
                  </div>
                </div>
              </div>
              <InputField
                disabled={true}
                name={"estimatedDuration"}
                label={"Estimated Duration"}
                placeholder={"Enter Estimated Duration"}
                required
              />
            </div>
          </>
        )
      )}
    </>
  );
};

export default SchedulingPage;
