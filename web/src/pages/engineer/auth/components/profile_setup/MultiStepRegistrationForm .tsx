// import { assetsConfig } from "@/assets";
// import { Button } from "@/shared/components/commonUI/Buttons";
// import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
// import axios from "axios";
// import { useState } from "react";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import type { CompleteRegistrationData } from "../types";
// import BackgroundVerification from "./BackgroundVerification";
// import ProfileSettingPage from "./ProfileSettingPage";
// import SetPassword from "./SetPassword";

// /**
//  * Multi-step Registration Form
//  */
// const MultiStepRegistrationForm = () => {
//   const navigate = useNavigate();
//   const [currentStep, setCurrentStep] = useState<number>(1);
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

//   const methods = useForm<CompleteRegistrationData>({
//     mode: "onSubmit",
//     defaultValues: {
//       // Step 1: Profile Setup
//       profileImage: undefined,
//       firstName: "testing",
//       lastName: "example",
//       email: "",
//       phone: "+91 8220932517",
//       address: "123 Main Street, City, State 12345",
//       skills: ["HTML"],
//       portfolio: "https://johndoe.dev",
//       amount: "50",
//       designation: "Developer",
//       company: "Labs",
//       country: "",
//       postalCode: "638701",
//       serviceCategory: "Web Development",
//       experience: "6",
//       resume: undefined,

//       // Step 2: Background Verification
//       governmentId: undefined,
//       certificate: undefined,

//       // Step 3: Password Create
//       password: "P@ssw0rd",
//       confirmPassword: "P@ssw0rd",

//       mobileOTP: "1234",
//       emailOTP: "1234",
//     },
//   });

//   const { trigger } = methods;

//   // Handle step validation & navigation
//   const handleStepSubmit: SubmitHandler<CompleteRegistrationData> = async (
//     data
//   ) => {
//     let isValid = false;

//     switch (currentStep) {
//       case 1:
//         isValid = await trigger([
//           "firstName",
//           "lastName",
//           "email",
//           "phone",
//           "address",
//           "country",
//           "postalCode",
//           "skills",
//           "portfolio",
//           "serviceCategory",
//           "amount",
//           "designation",
//           "company",
//           "experience",
//           "resume",
//         ]);
//         if (isValid) setCurrentStep(2);
//         break;

//       case 2:
//         setCurrentStep(3);
//         break;

//       case 3:
//         isValid = await trigger(["password", "confirmPassword"]);
//         if (isValid) submitCompleteForm(data);
//         break;
//     }
//   };

//   // FINAL FORM SUBMISSION (FormData + JSON)
//   const submitCompleteForm = async (data: CompleteRegistrationData) => {
//     setIsSubmitting(true);

//     try {
//       const formData = new FormData();

//       formData.append("email", data.email);
//       formData.append("phoneNumber", data.phone);
//       formData.append("password", data.password);
//       formData.append("fullName", `${data.firstName} ${data.lastName}`);
//       formData.append("address", data.address);
//       formData.append("jobSkills", data.skills ?? []);
//       formData.append("portfolioLink", data.portfolio ?? "");
//       formData.append("serviceCategory", data.serviceCategory ?? "");
//       formData.append("budget", data.amount ?? "");
//       formData.append("experiences", data.experience ?? "");
//       formData.append("designation", data.designation ?? "");
//       formData.append("company", data.company ?? "");
//       formData.append("postalCode", data.postalCode ?? "");
//       formData.append("country", data.country ?? "");

//       // FILES — Safely append
//       if (data.governmentId?.[0]) {
//         formData.append("governmentIdProofDocument", data.governmentId[0]);
//       }
//       if (data.certificate?.[0]) {
//         formData.append(
//           "certificationQualificationsDocument",
//           data.certificate[0]
//         );
//       }
//       // if (data.resume?.[0]) {
//       //   formData.append("resume", data.resume[0]);
//       // }
//        if (data.resume?.[0]) {
//         formData.append("resume", "770e8400-e29b-41d4-a716-446655440003");
//       }
//       if (data.profileImage?.[0]) {
//         formData.append("profilePicture", data.profileImage[0]);
//       }

//       // const res = await axios.post(
//       //   "http://localhost:8083/e/api/v1/eng/signup",
//       //   formData
//       // );
//       const res = await axios({
//         method: "post",
//         url: "http://localhost:8083/e/api/v1/eng/signup",
//         data: formData,
//         transformRequest: [(data) => JSON.stringify(Object.fromEntries(data))],
//         headers: { "Content-Type": "application/json" },
//       });

//       if (res.status === 200) navigate("/engineer/auth");
//     } catch (error) {
//       console.error("Submit error:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const goToPreviousStep = () => {
//     if (currentStep > 1) setCurrentStep(currentStep - 1);
//   };

//   // Step renderer
//   const renderStep = () => {
//     switch (currentStep) {
//       case 1:
//         return <ProfileSettingPage />;
//       case 2:
//         return <BackgroundVerification />;
//       case 3:
//         return <SetPassword />;
//       default:
//         return <ProfileSettingPage />;
//     }
//   };

//   return (
//     <FormContainer
//       methods={methods}
//       onSubmit={handleStepSubmit}
//       className="w-full h-full flex flex-col justify-between gap-4"
//     >
//       {currentStep > 1 && (
//         <div>
//           <button
//             type="button"
//             onClick={goToPreviousStep}
//             className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
//             aria-label="Go back"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5 text-gray-700"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M15 19l-7-7 7-7"
//               />
//             </svg>
//           </button>
//         </div>
//       )}

//       <div>
//         <div className="flex items-center justify-center">
//           <img
//             src={assetsConfig.logos.companyLogo}
//             alt="profile"
//             className="w-20 h-20"
//           />
//         </div>

//         <div
//           key={currentStep}
//           className="flex-1 p-2 relative gap-3 overflow-y-auto max-h-[75vh] w-full justify-items-center"
//         >
//           {renderStep()}
//         </div>

//         <div className="flex justify-center items-center w-full p-4">
//           <Button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-[30rem] bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
//           >
//             {currentStep === 3
//               ? isSubmitting
//                 ? "Submitting..."
//                 : "Complete Registration"
//               : "Next"}
//           </Button>
//         </div>
//       </div>
//     </FormContainer>
//   );
// };

// export default MultiStepRegistrationForm;

import { assetsConfig } from "@/assets";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import axios from "axios";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { CompleteRegistrationData } from "../types";
import BackgroundVerification from "./BackgroundVerification";
import ProfileSettingPage from "./ProfileSettingPage";
import SetPassword from "./SetPassword";

/**
 * Multi-step Registration Form
 */
const MultiStepRegistrationForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const methods = useForm<CompleteRegistrationData>({
    mode: "onSubmit",
    defaultValues: {
      // Step 1: Profile Setup
      profileImage: undefined,
      firstName: "testing",
      lastName: "example",
      email: "",
      phone: "+91 8220932517",
      address: "123 Main Street, City, State 12345",
      skills: ["HTML"],
      portfolio: "https://johndoe.dev",
      amount: "50",
      designation: "Developer",
      company: "Labs",
      country: "",
      postalCode: "638701",
      serviceCategory: "Web Development",
      experience: "6",
      resume: undefined,

      // Step 2: Background Verification
      governmentId: undefined,
      certificate: undefined,

      // Step 3: Password Create
      password: "P@ssw0rd",
      confirmPassword: "P@ssw0rd",

      mobileOTP: "1234",
      emailOTP: "1234",
    },
  });

  const { trigger } = methods;

  // Handle step validation & navigation
  const handleStepSubmit: SubmitHandler<CompleteRegistrationData> = async (
    data
  ) => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = await trigger([
          "firstName",
          "lastName",
          "email",
          "phone",
          "address",
          "country",
          "postalCode",
          "skills",
          "portfolio",
          "serviceCategory",
          "amount",
          "designation",
          "company",
          "experience",
          "resume",
        ]);
        if (isValid) setCurrentStep(2);
        break;

      case 2:
        setCurrentStep(3);
        break;

      case 3:
        isValid = await trigger(["password", "confirmPassword"]);
        if (isValid) submitCompleteForm(data);
        break;
    }
  };

  const submitCompleteForm = async (data: CompleteRegistrationData) => {
    setIsSubmitting(true);

    try {
      // 1️⃣ Create nested object for all non-file data
      const engineerPayload = {
        email: "karthi4@gmail.com",
        phoneNumber: data.phone,
        password: "",
        fullName: `${data.firstName} ${data.lastName}`,
        address: data.address,
        jobSkills: data.skills,
        portfolioLink: data.portfolio ?? "",
        serviceCategory: data.serviceCategory ?? "",
        budget: "",
        experienceYears: data.experience ?? "",
        designation: data.designation ?? "",
        company: data.company ?? "",
        postalCode: data.postalCode ?? "",
        country: data.country ?? "",
        resume: "770e8400-e29b-41d4-a716-446655440003",
        rate: "",
        experiences: [],
        governmentIdProofDocument: "",
        certificateQualificationsDocument: "",
        educations: [],
        tools: [],
        preferedWorkType: "",
        enableNotifications: false,
        profilePicture: "",
        isApproved: false,
        location: "",
        averageRating: 0,
      };

      const res = await axios.post(
        "http://localhost:8083/e/api/v1/eng/signup",
        engineerPayload
      );
      // const res = await axios({
      //   method: "post",
      //   url: "http://localhost:8083/e/api/v1/eng/signup",
      //   data: engineerPayload,
      //   transformRequest: [(data) => JSON.stringify(Object.fromEntries(data))],
      //   headers: { "Content-Type": "application/json" },
      // });

      if (res.status === 200) navigate("/engineer/auth");
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Step renderer
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ProfileSettingPage />;
      case 2:
        return <BackgroundVerification />;
      case 3:
        return <SetPassword />;
      default:
        return <ProfileSettingPage />;
    }
  };

  return (
    <FormContainer
      methods={methods}
      onSubmit={handleStepSubmit}
      className="w-full h-full flex flex-col justify-between gap-4"
    >
      {currentStep > 1 && (
        <div>
          <button
            type="button"
            onClick={goToPreviousStep}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
      )}

      <div>
        <div className="flex items-center justify-center">
          <img
            src={assetsConfig.logos.companyLogo}
            alt="profile"
            className="w-20 h-20"
          />
        </div>

        <div
          key={currentStep}
          className="flex-1 p-2 relative gap-3 overflow-y-auto max-h-[75vh] w-full justify-items-center"
        >
          {renderStep()}
        </div>

        <div className="flex justify-center items-center w-full p-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-[30rem] bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            {currentStep === 3
              ? isSubmitting
                ? "Submitting..."
                : "Complete Registration"
              : "Next"}
          </Button>
        </div>
      </div>
    </FormContainer>
  );
};

export default MultiStepRegistrationForm;
