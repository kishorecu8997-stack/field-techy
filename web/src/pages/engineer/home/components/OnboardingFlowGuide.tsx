import { icons } from "@/config/icons";
import { absoluteUrls } from "@/config/urls";
import { steps } from "@/dummy_data/onBoardingData";
import { usePopupStore } from "@/shared/store/popupStore";
import { useTour } from "@reactour/tour";
import { useEffect, useRef } from "react";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { RiVerifiedBadgeFill } from "react-icons/ri";

/**
 * OnboardingFlowGuide is a custom UI component used as the content popover
 * for the interactive product tour (onboarding guide) powered by Reactour.
 * It displays the current step's title and content, provides navigation controls
 * (Previous / Next / Skip / Finish), and handles persistence of onboarding status
 * via localStorage.
 *
 * The tour automatically disables itself if:
 * - The user has already completed onboarding (`localStorage.onboarding_guide === "true"`), OR
 * - The current route is not the engineer base path.
 *
 * It also prevents clicks outside the popover from closing the tour by
 * intercepting global click events during the tour.
 *
 * @component
 * @example
 * <TourProvider
 *   steps={steps}
 *   components={{ Popover: OnboardingFlowGuide }}
 *   showBadge={false}
 *   styles={tourStyles}
 * >
 *   <YourApp />
 * </TourProvider>
 */
const OnboardingFlowGuide = () => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const { showPopup, closePopup } = usePopupStore();
  const { currentStep, setCurrentStep, setIsOpen } = useTour();

  const Completebanner = () => {
    return (
      <div className="relative flex flex-col items-center text-center justify-center p-4 bg-white rounded-lg dark:bg-gray-800 sm:p-5">
        <span
          onClick={closePopup}
          className="cursor-pointer text-gray-400 text-3xl absolute top-0 right-2.5 "
        >
          <icons.close />
        </span>
        <span className="text-7xl text-[#083734]">
          <RiVerifiedBadgeFill />
        </span>
        <p className="mb-1 font-semibold text-xl">
          You're all set! Start applying for jobs
        </p>
        <p className="text-md font-normal text-gray-400">
          Start exploring jobs and manage your earnings easily.
        </p>
      </div>
    );
  };

  useEffect(() => {
    const onboarding = localStorage.getItem("onboarding_guide") === "true";
    const engineerpath = location.pathname.endsWith(
      absoluteUrls.engineer.home.dashboard,
    );
    if (!onboarding && engineerpath) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }

    const handleGlobalClick = (e: MouseEvent) => {
      const el = popoverRef.current;
      const path = e.composedPath?.() ?? [];
      const inside = el && (el.contains(e.target as Node) || path.includes(el));
      if (!inside) {
        e.stopPropagation();
        e.preventDefault();
      }
    };
    document.addEventListener("click", handleGlobalClick, true);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("click", handleGlobalClick, true);
      document.body.style.overflow = "auto";
    };
  }, [document.body.style.overflow]);

  const handlecomplete = async () => {
    await setIsOpen(false);
    await showPopup({
      title: "",
      body: <Completebanner />,
      actionButtons: [],
    });
    localStorage.setItem("onboarding_guide", "true");
  };

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const current = steps[currentStep];

  return (
    <div ref={popoverRef} className="flex flex-col gap-y-2">
      <span className="font-medium w-fit px-3 py-2 rounded-xl dark:bg-[#009966] bg-[#c4e9e4]">
        Step {currentStep + 1} of {steps.length}
      </span>
      <div className="text-xl dark:text-white font-bold">{current.title}</div>
      <p className="text-md text-gray-600 dark:text-gray-400 font-medium">
        {current.content}
      </p>
      <div className="flex items-center justify-between mt-4">
        <span
          className="font-medium cursor-pointer dark:text-[#009966] text-[#014d44]"
          onClick={() => {
            setIsOpen(false);
            localStorage.setItem("onboarding_guide", "true");
          }}
        >
          Skip
        </span>
        <div className="flex gap-3 items-center px-1 py-1">
          {!isFirstStep && (
            <span
              className="flex flex-row-reverse dark:text-white gap-2 items-center cursor-pointer"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Back
              <span className="p-1 flex justify-center items-center rounded-full border border-gray-400 size-8">
                <IoMdArrowBack className="font-medium text-gray-400" />
              </span>
            </span>
          )}

          {!isLastStep ? (
            <span
              className="flex gap-2 dark:text-white items-center cursor-pointer"
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              Next
              <span className="p-1 flex justify-center items-center border size-8 rounded-full dark:bg-[#009966] bg-[#014d44]">
                <IoMdArrowForward className="font-medium text-white" />
              </span>
            </span>
          ) : (
            <span
              className="flex gap-2 items-center dark:text-white  cursor-pointer"
              onClick={handlecomplete}
            >
              Finish
              <span className="p-1 flex justify-center items-center border size-8 rounded-full dark:bg-[#009966] bg-[#014d44]">
                <IoMdArrowForward className="font-medium text-white" />
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
export default OnboardingFlowGuide;
