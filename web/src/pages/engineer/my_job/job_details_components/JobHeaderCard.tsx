// import { icons } from "@/config/icons";
// import { validateDescription } from "@/pages/engineer/home/validation";
// import {
//   JOB_STATUSES,
//   WORKING_TYPES,
// } from "@/pages/engineer/search_result/types";
// import { Button } from "@/shared/components/commonUI/Buttons";
// import { TextareaInput } from "@/shared/components/commonUI/inputs";
// import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
// import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
// import SelectField from "@/shared/components/commonUI/inputs/SelectField";
// import Popup from "@/shared/components/Popup";
// import useDrawerStore from "@/shared/store/useDrawerStore";
// import React from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "react-toastify";
// import type { JobHeaderCardProps } from "../types";

// const JobHeaderCard: React.FC<JobHeaderCardProps> = ({
//   title,
//   client,
//   duration,
//   type,
//   status = "new",
//   setIsWorkSubmitted,
//   setSendProposal,
//   isSendProposal,
//   setActiveTab,
//   setOfferJobStatus,
//   OfferJobStatus,
// }) => {
//   const [open, setOpen] = React.useState(false);

//   const { setActiveKey, setISOpenSidebar } = useDrawerStore();

//   return (
//     <>
//       <div
//         className={`${
//           isSendProposal ? "text-gray-800 bg-yellow-50" : "bg-teal-800"
//         } p-5 rounded-xl shadow-md`}
//       >
//         <div className="flex justify-between items-center text-white">
//           <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
//           <span className="bg-gray-300 px-3 py-1.5 rounded-full text-sm font-medium text-gray-900">
//             {type === WORKING_TYPES.onsite ? "On Site" : "Remote"}
//           </span>
//         </div>

//         <div className="mt-3 flex flex-wrap gap-4 text-sm text-white">
//           <span className="flex items-center gap-1 ">🕒 {duration}</span>
//           <span>Client: {client}</span>
//         </div>

//         <div className="mt-4 flex flex-wrap gap-3 justify-end">
//           <span className="flex rounded-full text-sm font-medium">
//             {status === JOB_STATUSES.inprogress ? (
//               <div className="flex gap-2">
//                 <Button
//                   variant="primary"
//                   className=" rounded-md"
//                   onClick={() => setOpen(true)}
//                 >
//                   Update Log
//                 </Button>
//                 <Button
//                    variant="secondary"
//                   onClick={() => setIsWorkSubmitted?.(true)}
//                 >
//                   Submit work
//                 </Button>
//               </div>
//             ) : status === JOB_STATUSES.applied ? (
//               <div className="flex gap-2 items-center">
//                 <icons.checkCircle className="text-green-500 w-6 h-6" />
//                 <span className="text-lg text-white">Job Applied</span>
//               </div>
//             ) : status === JOB_STATUSES.new ? (
//               <div className="flex gap-2 items-center">
//                 {!isSendProposal && (
//                   <>
//                     <Button
//                       className="bg-teal-800 text-white px-6 py-2 rounded-md"
//                       onClick={() => setSendProposal?.(true)}
//                     >
//                       Update Log
//                     </Button>
//                     <Button
//                       className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
//                       onClick={() => {
//                         setIsWorkSubmitted?.(true);
//                         setActiveTab("Work Submissions");
//                       }}
//                     >
//                       View Job posting
//                     </Button>
//                   </>
//                 )}
//               </div>
//             ) : status === JOB_STATUSES.offer ? (
//               <div className="flex gap-2 items-center">
//                 {OfferJobStatus === undefined ? (
//                   <div className="flex gap-4">
//                     <Button
//                      variant="primary"
//                       onClick={() => setOfferJobStatus("accepted")}
//                     >
//                       Accept Job
//                     </Button>

//                     <Button
//                      variant="secondary"
//                       onClick={() => {
//                         setOfferJobStatus("declined");
//                         setActiveKey("cancelOffer");
//                         setISOpenSidebar(true);
//                       }}
//                     >
//                       Decline
//                     </Button>
//                   </div>
//                 ) : OfferJobStatus === "accepted" ? (
//                   <div className="flex gap-4">
//                     <Button
//                       variant="primary"
//                       onClick={() => setOfferJobStatus("started")}
//                     >
//                       Start Job
//                     </Button>

//                     <Button
//                       variant="secondary"
//                       onClick={() => {
//                         setOfferJobStatus("declined");
//                         setActiveKey("cancelOffer");
//                         setISOpenSidebar(true);
//                       }}
//                     >
//                       Decline
//                     </Button>
//                   </div>
//                 ) : OfferJobStatus === "started" ? (
//                   <Button
//                     variant="primary"
//                     onClick={() => setOfferJobStatus("checked-in")}
//                   >
//                     Check in
//                   </Button>
//                 ) : (
//                   <div className="flex gap-2">
//                     <Button
//                        variant="primary"
//                       onClick={() => setOpen(true)}
//                     >
//                       Update Log
//                     </Button>
//                     <Button
//                       variant="secondary"
//                       onClick={() => {
//                         setIsWorkSubmitted?.(true);
//                         setActiveTab("Work Submissions");
//                       }}
//                     >
//                       Submit Work
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="flex gap-2 items-center">
//                 <icons.checkCircle className="text-green-500 w-6 h-6" />
//                 <span className="text-lg text-white">Job Completed</span>
//               </div>
//             )}
//           </span>
//         </div>
//       </div>
//       <Popup open={open} onClose={() => setOpen(false)}>
//         <UpdateStatus onClose={() => setOpen(false)} />
//       </Popup>
//     </>
//   );
// };

// export default JobHeaderCard;

// // -----------------------------------------------------
// // Subcomponent
// // -----------------------------------------------------

// const UpdateStatus = ({ onClose }: { onClose: () => void }) => {
//   const FormCtx = useForm();

//   const handleSubmit = () => {
//     toast.success("Job status updated successfully!");
//   };

//   return (
//     <div className="flex flex-col p-6">
//       <div className="flex justify-end">
//         <button onClick={onClose}>
//           <icons.close className="w-6 h-6" />
//         </button>
//       </div>

//       <div className="text-xl font-bold text-center">Update Status</div>

//       <FormContainer methods={FormCtx} onSubmit={handleSubmit}>
//         <SelectField
//           name="status"
//           label="Status"
//           required
//           options={[
//             { label: "In Progress", value: "in-progress" },
//             { label: "Completed", value: "completed" },
//           ]}
//         />

//         <TextareaInput
//           name="remarks"
//           label="Remarks"
//           required
//           rules={validateDescription(5, 2000, "remarks")}
//         />

//         <FileUpload
//           name="workScreenShot"
//           label="Work Screenshot"
//           required
//           accept=".pdf"
//         />

//         <Button
//           type="submit"
//           className="w-full bg-teal-800 text-white py-2 rounded-lg mt-5"
//         >
//           Submit
//         </Button>
//       </FormContainer>
//     </div>
//   );
// };


import { icons } from "@/config/icons";
import { validateDescription } from "@/pages/engineer/home/validation";
import {
  JOB_STATUSES,
  WORKING_TYPES,
} from "@/pages/engineer/search_result/types";
import { Button } from "@/shared/components/commonUI/Buttons";
import { TextareaInput } from "@/shared/components/commonUI/inputs";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import Popup from "@/shared/components/Popup";
import useDrawerStore from "@/shared/store/useDrawerStore";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { JobHeaderCardProps } from "../types";

/**
 * Displays the main header card for a job with title, client, duration, type, and status.
 */
const JobHeaderCard: React.FC<JobHeaderCardProps> = ({
  title,
  client,
  duration,
  type,
  status = "new",
  setIsWorkSubmitted,
  setSendProposal,
  isSendProposal,
  setIsJobAccepted,
  setActiveTab,
  OfferJobStatus,
  setOfferJobStatus,
}) => {
  const [open, setOpen] = React.useState(false);
  const { setActiveKey, setISOpenSidebar } = useDrawerStore();

  return (
    <>
      <div
        className={`${
          isSendProposal
            ? "text-gray-800 bg-yellow-50"
            : "bg-teal-800 text-white"
        } p-5 rounded-xl shadow-md`}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
          <span className="bg-gray-300 backdrop-blur-sm px-3 py-1.5 rounded-md text-sm font-medium justify-items-center h-fit justify-center items-center text-gray-900 whitespace-nowrap">
            {type === WORKING_TYPES.onsite ? "On Site" : "Remote"}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-sm justify-start items-start">
          <span className="flex items-center gap-1">🕒 {duration}</span>
          <span>Client: {client}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 h-fit justify-end">
          <span className="flex rounded-md text-sm font-medium h-fit justify-end items-end w-fit">
            {status === JOB_STATUSES.inprogress ? (
              <div className="flex flex-wrap gap-2 w-fit">
                <Button
                  className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
                  onClick={() => setOpen(true)}
                >
                  Update Log
                </Button>
                <Button
                  className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
                  onClick={() => {
                    setIsWorkSubmitted?.(true);
                    setActiveTab("Work Submissions");
                  }}
                >
                  Submit work
                </Button>
              </div>
            ) : status === JOB_STATUSES.applied ? (
              <div className="flex flex-wrap gap-2 w-fit items-center">
                <icons.checkCircle className="text-green-500 w-6 h-6" />
                <span className="text-lg">Job Applied</span>
              </div>
            ) : status === JOB_STATUSES.new ? (
              <div className="flex flex-wrap gap-2 w-fit items-center">
                {!isSendProposal ? (
                  <Button
                    className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
                    onClick={() => setSendProposal?.(true)}
                  >
                    Send Proposal
                  </Button>
                ) : (
                  <div
                    className="text-green-700 hover:underline cursor-pointer"
                    onClick={() => setSendProposal?.(false)}
                  >
                    View Job posting
                  </div>
                )}
              </div>
            ) : status === JOB_STATUSES.offer ? (
              <div className="flex flex-wrap gap-2 w-fit items-center">
                {OfferJobStatus === "initial" ? (
                  <div className="flex flex-row gap-4">
                    <Button
                      className="bg-teal-800 text-black px-6 py-2 rounded-md font-medium border border-gray-300"
                      onClick={() => setOfferJobStatus("accepted")}
                    >
                      Accept Job
                    </Button>

                    <Button
                      className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
                      onClick={() => {
                        setOfferJobStatus(undefined);
                        setActiveKey("cancelOffer");
                        setISOpenSidebar(true);
                      }}
                    >
                      Decline
                    </Button>
                  </div>
                ) : OfferJobStatus === "accepted" ? (
                  <div className="flex flex-row gap-4">
                    <Button
                      className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
                      onClick={() => {
                        setOfferJobStatus("started");
                      }}
                    >
                      Start Job
                    </Button>

                    <Button
                      className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
                      onClick={() => {
                        setOfferJobStatus(undefined);
                        setActiveKey("cancelOffer");
                        setISOpenSidebar(true);
                      }}
                    >
                      Decline
                    </Button>
                  </div>
                ) : OfferJobStatus === "started" ? (
                  <Button
                    className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
                    onClick={() => {
                      setOfferJobStatus("checked-in");
                    }}
                  >
                    Check in
                  </Button>
                ) : (
                  <div className="flex flex-wrap gap-2 w-fit">
                    <Button
                      className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
                      onClick={() => setOpen(true)}
                    >
                      Update Log
                    </Button>
                    <Button
                      className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
                      onClick={() => {
                        setIsWorkSubmitted?.(true);
                        setActiveTab("Work Submissions");
                      }}
                    >
                      Submit Work
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 w-fit items-center">
                <icons.checkCircle className="text-green-500 w-6 h-6" />
                <span className="text-lg">Job Completed</span>
              </div>
            )}
          </span>
        </div>
      </div>
      <Popup open={open} onClose={() => setOpen(false)}>
        <UpdateStatus onClose={() => setOpen(false)} />
      </Popup>
    </>
  );
};

export default JobHeaderCard;

const UpdateStatus = ({ onClose }: { onClose: () => void }) => {
  const FormCtx = useForm();

  const handleSubmit = () => {
    console.log("Submitted");
    toast.success("Job status updated successfully!");
  };
  return (
    <div className="flex flex-col p-6">
      <div className="flex justify-end">
        <button
          className="cursor-pointer text-gray-500 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
          onClick={onClose}
        >
          <icons.close className="w-6 h-6" />
        </button>
      </div>
      <div className="text-xl text-gray-900 dark:text-white font-bold text-center">
        Update Status
      </div>
      <FormContainer methods={FormCtx} onSubmit={handleSubmit}>
        <SelectField
          name="status"
          label="Status"
          required
          options={[
            { label: "In Progress", value: "in-progress" },
            { label: "Completed", value: "completed" },
          ]}
        />
        <TextareaInput
          name="remarks"
          label="Remarks"
          required
          rules={validateDescription(5, 2000, "remarks")}
        />
        <FileUpload
          name="workScreenShot"
          label="Work Screenshot"
          required
          accept=".pdf"
          maxPages={5}
          validatePDF={true}
        />
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition mt-5"
        >
          Submit
        </Button>
      </FormContainer>
    </div>
  );
};