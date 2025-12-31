import React, { useEffect, useRef } from "react";
import { useTour } from "@reactour/tour";
import { steps } from "@/dummy_data/onBoardingDate";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FaArrowLeftLong } from "react-icons/fa6";
import { toast } from "react-toastify";
import { urls } from "@/config/urls";

const OnboardingFlowGuide = () => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const { currentStep, setCurrentStep, setIsOpen } = useTour();
  useEffect(() => {
    const onboarding = localStorage.getItem("onboarding_guide") === "true";
    const engineerpath = location.pathname.endsWith(urls.engineer.base);
    if (onboarding || !engineerpath) {
      setIsOpen(false);
      return;
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

  const handlecomplete = () => {
    setIsOpen(false);
    toast.success("Ready to survey the engineer");
    localStorage.setItem("onboarding_guide", "true");
  };

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const current = steps[currentStep];

  return (
    <div ref={popoverRef} className="flex flex-col gap-y-2">
      <span className="font-bold w-fit px-3 py-2 rounded-lg bg-[#065450] text-white">
        Step {currentStep + 1}
      </span>
      <div className="text-xl font-semibold">{current.title}</div>
      <p className="text-md text-gray-600">{current.content}</p>
      <div className="flex justify-between mt-4">
        <Button size="sm" variant="outline" onClick={() => setIsOpen(false)}>
          Skip
        </Button>
        <div className="flex gap-3 px-1 py-1">
          <Button
            variant="outline"
            disabled={isFirstStep}
            onClick={() => setCurrentStep(currentStep - 1)}
          >
            <FaArrowLeftLong />
          </Button>

          {!isLastStep ? (
            <Button
              size="md"
              variant="primary"
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              Next
            </Button>
          ) : (
            <Button size="sm" variant="primary" onClick={handlecomplete}>
              Finish
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
export default OnboardingFlowGuide;

export const tourStyles = {
  maskArea: (base: any) => ({
    ...base,
    rx: 10,
    overflow: "hidden",
  }),
  badge: (base: any) => ({
    ...base,
    backgroundColor: "#005e59",
  }),
  controls: (base: any) => ({
    ...base,
    marginTop: 12,
  }),
  dot: (base: any, { current }: any) => ({
    ...base,
    backgroundColor: current ? "#005e59" : "#e0e0e0",
  }),
};
