import { repeatByOptions } from "@/dummy_data/client";
import { InputField } from "@/shared/components/commonUI/inputs";
import CustomTimePicker from "@/shared/components/commonUI/inputs/CustomTimePicker";
import { DatePickerInput } from "@/shared/components/commonUI/inputs/DatePickerInput";
import { RadioField } from "@/shared/components/commonUI/inputs/RadioField";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import usePostAJobStore, {
  CurrentLocation,
} from "@/shared/store/postAJobStore";
import { getDurationString } from "@/utils";
import { getMonthList, getOrdinalList } from "@/utils/scheduleFuntions";
import {
  validateCurrentOrFutureDate,
  validateEndDate,
} from "../../../post_job/Validates";
import { useEffect, useMemo } from "react";
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

  // const minTentativeEndDate = getMinTentativeEndDate(
  //   applicationEndDate,
  //   tentativeStartDate
  // );

  const minStartTimes = useMemo(() => {
    if (!applicationEndDate) return undefined;
    const selectedDate = new Date(applicationEndDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate.getTime() === today.getTime()) {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 1);
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    }
    return undefined;
  }, [applicationEndDate]);

  const minStartTime = useMemo(() => {
    if (!startDate) return undefined;
    if (startDate) {
      const selectedDate = new Date(startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      if (selectedDate.getTime() === today.getTime()) {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 1);
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
      }
    }
    return undefined;
  }, [startDate]);

  const getMaxDate = (startDate?: Date) => {
    const baseDate = startDate || new Date();
    const maxDate = new Date(baseDate);
    maxDate.setMonth(maxDate.getMonth() + 24);
    return maxDate;
  };

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

  useEffect(() => {
    if (!tentativeStartDate) {
      ctx.setValue("tentativeEndDate", null);
    }
  }, [tentativeStartDate, ctx]);

  const addMonthsPreserveEndOfMonth = (
    date: Date,
    monthsToAdd: number,
  ): Date => {
    const originalDay = date.getDate();
    const startYear = date.getFullYear();
    const startMonth = date.getMonth();
    const targetMonthIndex = startMonth + monthsToAdd;
    const temp = new Date(date);
    temp.setFullYear(startYear, targetMonthIndex, 1);
    const lastDayOfTargetMonth = new Date(
      temp.getFullYear(),
      temp.getMonth() + 1,
      0,
    ).getDate();
    temp.setDate(Math.min(originalDay, lastDayOfTargetMonth));
    return temp;
  };

  const getDedicatedEndDateRange = (startDate: string | Date) => {
    if (!startDate) {
      return { min: undefined, max: undefined };
    }
    const start = new Date(startDate);
    const min = addMonthsPreserveEndOfMonth(start, 6);
    const max = addMonthsPreserveEndOfMonth(start, 24);
    return { min, max };
  };

  const { min: minEndDate, max: maxEndDate } = useMemo(() => {
    if (currentLocation === CurrentLocation.dedicated && tentativeStartDate) {
      return getDedicatedEndDateRange(tentativeStartDate);
    }
    return { min: undefined, max: undefined };
  }, [tentativeStartDate, currentLocation]);

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
                  validate: (value) => validateCurrentOrFutureDate(value),
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
                minTime={minStartTimes}
              />
            </div>
          </div>
          <div className="flex flex-row w-full gap-4 items-center">
            <div className="relative w-full">
              <Controller
                name="tentativeStartDate"
                rules={{
                  validate: (value) => validateCurrentOrFutureDate(value),
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
                    />
                  </>
                )}
              />
            </div>
            <div className="relative w-full">
              <Controller
                name="tentativeEndDate"
                rules={{
                  validate: (value) => validateCurrentOrFutureDate(value),
                }}
                control={ctx.control}
                render={({ field }) => (
                  <>
                    <DatePickerInput
                      disabled={isDisable}
                      label="Tentative End Date"
                      placeholder={
                        tentativeStartDate && minEndDate && maxEndDate
                          ? `Select between ${minEndDate.toDateString()} - ${maxEndDate.toDateString()}`
                          : "Select Tentative End Date"
                      }
                      {...field}
                      minDate={minEndDate}
                      maxDate={maxEndDate}
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
                        validate: (value) => validateCurrentOrFutureDate(value),
                      }}
                      control={ctx.control}
                      render={({ field }) => (
                        <>
                          <DatePickerInput
                            disabled={isDisable}
                            label="Start Date"
                            placeholder="Select start date"
                            minDate={new Date(new Date().setHours(0, 0, 0, 0))}
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
                        minTime={minStartTime}
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
                      validate: (value) => validateCurrentOrFutureDate(value),
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
                          maxDate={getMaxDate()}
                          minDate={startDate}
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
                            validateCurrentOrFutureDate(value),
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
                            validateCurrentOrFutureDate(value),
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
                        validate: (value) => validateCurrentOrFutureDate(value),
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
                            minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                            maxDate={endDate ? endDate : null}
                          />
                        </>
                      )}
                    />
                  </div>
                  <div className="relative w-full">
                    <CustomTimePicker
                      label="Start Time"
                      name="startTime"
                      required
                      maxTime={endTime}
                      minTime={minStartTime}
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
                          validateEndDate(value, ctx.getValues("startDate")),
                      }}
                      control={ctx.control}
                      render={({ field }) => (
                        <>
                          <DatePickerInput
                            label="End Date"
                            placeholder="Select End date"
                            {...field}
                            required
                            minDate={startDate || undefined}
                            maxDate={
                              startDate
                                ? new Date(
                                    startDate.getTime() + 24 * 60 * 60 * 1000,
                                  )
                                : undefined
                            } // max 24 hours
                            disabled={isDisable}
                          />
                        </>
                      )}
                    />
                  </div>
                  <div className="relative w-full">
                    <CustomTimePicker
                      label="End Time"
                      name="endTime"
                      required
                      maxTime={startTime}
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
