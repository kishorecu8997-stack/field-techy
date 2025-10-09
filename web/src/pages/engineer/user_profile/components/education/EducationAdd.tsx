// import React, { useState } from "react";
// import DrawerHeader from "@/shared/components/DrawerHeader";
// import { PhoneInputField } from "@/shared/components/commonUI/inputs/PhoneInputField";
// import { InputField } from "@/shared/components/commonUI/inputs";
// import { CiLocationOn } from "react-icons/ci";
// import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
// import { useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { FaRegUser } from "react-icons/fa";
// import { MdOutlineMailOutline } from "react-icons/md";
// import { Button } from "@/shared/components/Buttons";

// export type AddEducationFormData = {
//   fullName: string;
//   phoneNumber: string;
//   emailId: string;
//   addressLocation: string;
// };

// interface PersonalInfoProps {
//   onClose: () => void;
// }

// const AddEducation: React.FC<PersonalInfoProps> = ({ onClose }) => {
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(false);

//   const handleSubmit = () => {
//     // navigate(urls.auth.login);    
//   };

//   const methods = useForm<EditProfileFormData>({
//     defaultValues: {
//       fullName: "",
//       phoneNumber: "",
//       emailId: "",
//       addressLocation: "",
//     },
//   });

//   return (
//     <div className="relative flex flex-col h-screen bg-white">
//       <FormContainer
//         methods={methods}
//         onSubmit={handleSubmit}
//         className="flex flex-col h-full"
//       >
//         {/* Header */}
//         <DrawerHeader title="Personal Information" onClose={onClose} />

//         {/* Scrollable content */}
//         <div className="flex-1 overflow-y-auto px-3 pb-24 space-y-3">
//           {/* Full Name */}
//           <InputField
//             name="name"
//             type="text"
//             placeholder="Full Name"
//             leftIcon={<FaRegUser className="text-lg text-gray-500" />}
//             required
//           />

//           {/* Phone Number */}
//           <PhoneInputField name="phone" required />

//           {/* Email */}
//           <InputField
//             name="email"
//             type="email"
//             placeholder="Enter Email"
//             leftIcon={
//               <MdOutlineMailOutline className="text-lg text-gray-500" />
//             }
//             required
//           />

//           {/* Address/Location */}
//           <InputField
//             name="address"
//             type="text"
//             placeholder="Address/Location"
//             leftIcon={<CiLocationOn className="text-lg text-gray-500" />}
//             required
//           />
//         </div>

//         {/* Fixed bottom button */}
//         <div className=" bottom-0  p-10 bg-white ">
//           <Button
//             type="submit"
//             className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
//           >
//             Edit Profile
//           </Button>
//         </div>
//       </FormContainer>
//     </div>
//   );
// };

// export default AddEducation;
