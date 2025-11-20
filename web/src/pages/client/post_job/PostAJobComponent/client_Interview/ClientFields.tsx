import { DatePickerInput } from '@/shared/components/commonUI/inputs/DatePickerInput'
import { InputField } from '@/shared/components/commonUI/inputs/InputField'
import TimeInput from '@/shared/components/commonUI/inputs/TimeInput'
import { validateDateRange } from '@/utils/validate'
import { Controller, useFormContext } from 'react-hook-form'
import SectionHeader from '../SectionHeader'

const ClientFields = () => {

    const ctx = useFormContext()

  return (
     <div className="flex-1">
        <InputField
          label="First Name"
          name="firstName"
          placeholder="first Name"
        />
        <InputField label="Last Name" name="lastName" placeholder="last Name" />
        <InputField
          label="Email"
          name="clientEmail"
          placeholder="Client Email"
        />
        <InputField
          label="Phone"
          name="clientPhone"
          placeholder="Client Phone"
        />
        <div className="py-2">
        <SectionHeader title=" Interview Schedule Info" />
        </div>
        <div className="flex flex-col w-full gap-2 items-center">
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
                    <p className="text-red-600 text-sm">{error.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div className="w-full">
            <TimeInput label="Start Time" name="startTime" required />
          </div>
        </div>
      </div>
  )
}

export default ClientFields
