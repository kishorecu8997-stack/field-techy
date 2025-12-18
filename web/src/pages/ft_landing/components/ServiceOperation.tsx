import React from "react";
import { serviceOperationStats } from "../type";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { InputField, TextareaInput } from "@/shared/components/commonUI/inputs";
import { useForm } from "react-hook-form";
import { validateEmailRules } from "@/shared/components/commonUI/emailValidation";
import { validateCompany, validateName } from "@/utils/validate";
import { Button } from "@/shared/components/commonUI/Buttons";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import countries from "@/dummy_data/countries";
import { citiesByCountry } from "@/dummy_data/adminClientData";

export default function ServiceOperations() {
  const methods = useForm({
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

  const handleSubmit = (data: any) => {
    console.log("Form Submitted", data);
  };

  return (
    <div className="mb-6 bg-white dark:bg-gray-900">
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

          {/* Right Column: Form Placeholder */}
          <div className="md:w-8/12 bg-white p-4 rounded-xl shadow-md border border-gray-100">
            <div className="">
              <h3 className="font-medium text-gray-900 text-lg">
                Contact Sales
              </h3>
              <p className=" text-gray-600">
                Tell us about your needs and we'll be in touch.
              </p>

              {/* Placeholder to show where form will go */}
              <div className="p-2 flex items-center justify-center text-gray-500 text-sm">
                <FormContainer
                  methods={methods}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-2 w-full"
                >
                  <InputField
                    name="fullName"
                    label="Full Name"
                    type="text"
                    required
                    rules={{
                      validate: (v: string) => validateName(v),
                    }}
                  />
                  <div className="grid md:flex items-center gap-4">
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
                  <div className="grid md:flex items-center gap-4">
                    <div className="md:w-1/2">
                      <SelectField
                        name="country"
                        label="Country"
                        placeholder="Select Country"
                        options={countries}
                        required
                      />
                    </div>
                    <div className="md:w-1/2">
                      <SelectField
                        label="City"
                        name="city"
                        placeholder="Select city"
                        options={cityOptions}
                        required
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
      </div>
    </div>
  );
}
