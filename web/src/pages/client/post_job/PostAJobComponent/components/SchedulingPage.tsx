import { InputField } from "@/shared/components/commonUI/inputs";
import { DatePickerInput } from "@/shared/components/commonUI/inputs/DatePickerInput";
import { RadioField } from "@/shared/components/commonUI/inputs/RadioField";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import TimeInput from "@/shared/components/commonUI/inputs/TimeInput";
import usePostAJobStore, {
  CurrentLocation,
} from "@/shared/store/postAJobStore";
import { validateDateRange } from "@/utils/validate";
import { Controller, useFormContext } from "react-hook-form";
import {
  OccurrenceEndType,
  OccurrenceFields,
  RepeatByFields,
} from "../../types";
import SectionHeader from "../SectionHeader";
import { getMonthList, getOrdinalList } from "@/utils/scheduleFuntions";

const SchedulingPage = () => {
  const ctx = useFormContext();
  const watchOccurrence = ctx.watch("jobOccurrence");
  const watchOccurrenceEndType = ctx.watch("occurrenceEndType");
  const watchRepeatedBy = ctx.watch("repeatedBy");
  const { currentLocation } = usePostAJobStore();

  return (
    <>
      <SectionHeader title="Scheduling" />
      {currentLocation === CurrentLocation.dedicated ? (
        <div className="w-full space-y-2">
          <div className="flex flex-row w-full gap-2 items-center">
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
                render={({ field, fieldState: { error } }) => (
                  <>
                    <DatePickerInput
                      label="Tentative Start Date"
                      placeholder="Select Tentative start date"
                      {...field}
                      required
                    />
                    {error && (
                      <p className="text-red-600 text-sm">{error.message}</p>
                    )}
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
                render={({ field, fieldState: { error } }) => (
                  <>
                    <DatePickerInput
                      label="Tentative End Date"
                      placeholder="Select Tentative End date"
                      {...field}
                      required
                    />
                    {error && (
                      <p className="text-red-600 text-sm">{error.message}</p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
          <div className="flex flex-row w-full gap-2 items-center">
            <div className="relative w-full">
              <Controller
                name="tentativeEndDate"
                rules={{
                  validate: (value) =>
                    validateDateRange(value, ctx.getValues("tentativeEndDate")),
                }}
                control={ctx.control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <DatePickerInput
                      label="Tentative End Date"
                      placeholder="Select Tentative End date"
                      {...field}
                      required
                    />
                    {error && (
                      <p className="text-red-600 text-sm">{error.message}</p>
                    )}
                  </>
                )}
              />
            </div>
            <div className="w-full">
              <TimeInput
                label="Tentative End Time"
                name="tentativeEndTime"
                required
              />
            </div>
          </div>
          <InputField
            name={"jobDuration"}
            label={"Job Duration"}
            placeholder={"Enter Job Duration"}
          />
        </div>
      ) : currentLocation === CurrentLocation.scheduled ? (
        <div className="w-full space-y-2">
          <RadioField
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
                name="repeatedBy"
                label="Repeated By"
                options={[
                  { value: RepeatByFields.week, label: "Week" },
                  { value: RepeatByFields.month, label: "Month" },
                  { value: RepeatByFields.year, label: "Year" },
                ]}
                required
              />
              {watchRepeatedBy === RepeatByFields.week ? (
                <>
                  <>Date components</>
                  <div className="relative w-full">
                    <Controller
                      name="startDate"
                      rules={{
                        validate: (value) =>
                          validateDateRange(value, ctx.getValues("startDate")),
                      }}
                      control={ctx.control}
                      render={({ field, fieldState: { error } }) => (
                        <>
                          <DatePickerInput
                            label="Start Date"
                            placeholder="Select start date"
                            {...field}
                            required
                          />
                          {error && (
                            <p className="text-red-600 text-sm">
                              {error.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>
                  <div className="flex flex-row w-full gap-2 items-center">
                    <div className="w-full">
                      <TimeInput label="Start Time" name="startTime" required />
                    </div>
                    <div className="w-full">
                      <TimeInput label="End Time" name="endTime" required />
                    </div>
                  </div>
                </>
              ) : watchRepeatedBy === RepeatByFields.month ? (
                <div className="mt-2">
                  <SelectField
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
                        label="Repeat Year"
                        name="repeatedByYear"
                        required
                        options={getMonthList()}
                      />
                    </div>
                    <div className="w-full">
                      <SelectField
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
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <DatePickerInput
                          label="Job Occurrence End Date*"
                          placeholder="Select Job Occurrence end date"
                          {...field}
                          required
                        />
                        {error && (
                          <p className="text-red-600 text-sm">
                            {error.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
              ) : (
                <InputField
                  name="after"
                  label="After (Number of Occurrences"
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
                        name="startDate"
                        rules={{
                          validate: (value) =>
                            validateDateRange(
                              value,
                              ctx.getValues("startDate")
                            ),
                        }}
                        control={ctx.control}
                        render={({ field, fieldState: { error } }) => (
                          <>
                            <DatePickerInput
                              label="Start Date"
                              placeholder="Select start date"
                              {...field}
                              required
                            />
                            {error && (
                              <p className="text-red-600 text-sm">
                                {error.message}
                              </p>
                            )}
                          </>
                        )}
                      />
                    </div>
                    <div className="w-full">
                      <TimeInput label="Start Time" name="startTime" required />
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
                        render={({ field, fieldState: { error } }) => (
                          <>
                            <DatePickerInput
                              label="End Date"
                              placeholder="Select End date"
                              {...field}
                              required
                            />
                            {error && (
                              <p className="text-red-600 text-sm">
                                {error.message}
                              </p>
                            )}
                          </>
                        )}
                      />
                    </div>
                    <div className="w-full">
                      <TimeInput label="End Time" name="endTime" required />
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
                      render={({ field, fieldState: { error } }) => (
                        <>
                          <DatePickerInput
                            label="Start Date"
                            placeholder="Select start date"
                            {...field}
                            required
                          />
                          {error && (
                            <p className="text-red-600 text-sm">
                              {error.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>
                  <div className="w-full">
                    <TimeInput label="Start Time" name="startTime" required />
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
                      render={({ field, fieldState: { error } }) => (
                        <>
                          <DatePickerInput
                            label="End Date"
                            placeholder="Select End date"
                            {...field}
                            required
                          />
                          {error && (
                            <p className="text-red-600 text-sm">
                              {error.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>
                  <div className="w-full">
                    <TimeInput label="End Time" name="endTime" required />
                  </div>
                </div>
              </div>
              <InputField
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
