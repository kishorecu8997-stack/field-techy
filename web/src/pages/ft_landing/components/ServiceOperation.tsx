import React from "react";
import { serviceOperationStats, type ServiceOperationFormData } from "../type";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { InputField, TextareaInput } from "@/shared/components/commonUI/inputs";
import { useForm, Controller } from "react-hook-form";
import { validateEmailRules } from "@/shared/components/commonUI/emailValidation";
import { validateCompany, validateName } from "@/utils/validate";
import { Button } from "@/shared/components/commonUI/Buttons";
import countries from "@/dummy_data/countries";
import { citiesByCountry } from "@/dummy_data/adminClientData";

/**
 * ServiceOperations component for the homepage.
 *
 * @returns {JSX.Element} The rendered service operations component.
 */
export default function ServiceOperations() {
  const methods = useForm<ServiceOperationFormData>({
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      company: "",
      country: "",
      city: "",
      message: "",
    },
  });

  const selectedCountry = methods.watch("country");
  const cityOptions = selectedCountry
    ? citiesByCountry[selectedCountry] || []
    : [];

  const handleSubmit = (data: ServiceOperationFormData) => {
    console.log("Form Submitted", data);
  };

  return (
    <div className="pb-6">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
            Smarter Control For All Your Service Operations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:flex gap-8">
          <div className="space-y-6 md:w-4/12">
            {serviceOperationStats.map((stat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#024e51] text-white"
              >
                <div className="text-2xl text-[#95cc5c]">
                  {React.createElement(stat.icon)}
                </div>
                <div>
                  <div className="opacity-80 mt-2">{stat.title}</div>
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm opacity-80">{stat.subtitle}</div>
              </div>
            ))}
          </div>

          <div className="md:w-8/12 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-[#d1d5dc] dark:border-[#4a5565]">
            <h3 className="font-medium dark:text-white text-lg">
              Contact Sales
            </h3>
            <p className="text-gray-600 mb-4">
              Tell us about your needs and we'll be in touch.
            </p>

            <FormContainer
              methods={methods}
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 w-full"
            >
              <InputField
                name="fullName"
                label="Full Name"
                type="text"
                required
                rules={{ validate: (v: string) => validateName(v) }}
              />

              <div className="grid md:flex gap-4">
                <InputField
                  name="email"
                  label="Email Address"
                  type="text"
                  required
                  rules={validateEmailRules}
                />
                <InputField
                  name="company"
                  label="Company"
                  type="text"
                  required
                  rules={{ validate: (v: string) => validateCompany(v) }}
                />
              </div>

              {/* Normal HTML Selects with Controller */}
              <div className="grid md:flex gap-4">
                <div className="md:w-1/2">
                  <Controller
                    name="country"
                    control={methods.control}
                    rules={{ required: "Country is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700 dark:text-gray-200">
                          Country
                        </label>
                        <select
                          {...field}
                          className={`border rounded-md p-3 focus:outline-none focus:ring focus:ring-[#d1d5dc] dark:bg-gray-800 dark:text-white ${
                            error
                              ? "border-red-500"
                              : "border-[#d1d5dc] dark:border-[#4a5565]"
                          }`}
                        >
                          <option value="" disabled hidden>
                            Select a country
                          </option>
                          {countries.map((c) => (
                            <option
                              key={c.value}
                              value={c.value}
                              className="rounded-lg"
                            >
                              {c.label}
                            </option>
                          ))}
                        </select>
                        {error && (
                          <span className="text-red-600 text-sm mt-1">
                            {error.message}
                          </span>
                        )}
                      </div>
                    )}
                  />
                </div>

                <div className="md:w-1/2">
                  <Controller
                    name="city"
                    control={methods.control}
                    rules={{ required: "City is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700 dark:text-gray-200">
                          City
                        </label>
                        <select
                          {...field}
                          className={`border rounded-md  p-3 focus:outline-none focus:ring-1 focus:ring-[#d1d5dc] dark:bg-gray-800 dark:text-white ${
                            error
                              ? "border-red-500"
                              : "border-[#d1d5dc] dark:border-[#4a5565]"
                          }`}
                        >
                          <option value="" disabled hidden>
                            Select a city
                          </option>
                          {cityOptions.map((c) => (
                            <option key={c.value} value={c.value}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                        {error && (
                          <span className="text-red-600 text-sm mt-1">
                            {error.message}
                          </span>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>

              <TextareaInput name="message" label="Message" />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="text"
                  className="bg-[#95cc5c] flex items-center cursor-pointer text-black px-6 py-2 rounded-full font-medium hover:bg-[#85b850] w-fit"
                >
                  Send Message
                </Button>
              </div>
            </FormContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
