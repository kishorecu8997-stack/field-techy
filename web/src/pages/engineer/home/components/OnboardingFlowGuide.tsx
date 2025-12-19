import { OnboardingSteps } from "@/dummy_data/engineers";
import { Button } from "@/shared/components/commonUI/Buttons";
import Popup from "@/shared/components/Popup";
import React, {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

interface OnBoardingProps {
  onBoardOpen: boolean;
  setOnBoard: Dispatch<SetStateAction<boolean>>;
  setAccessPopup: Dispatch<SetStateAction<boolean>>;
}

const OnboardingFlowGuide: React.FC<OnBoardingProps> = ({
  onBoardOpen,
  setOnBoard,
  setAccessPopup,
}) => {
  const [step, setStep] = useState(0);
  const current = OnboardingSteps[step];
  const Icon = current?.icon;

  useEffect(() => {
    if (step === OnboardingSteps.length) {
      finishOnboarding();
    } else if (step < 0 || step > OnboardingSteps.length) {
      setOnBoard(false);
    }
  }, [step]);

  const finishOnboarding = () => {
    localStorage.setItem("onboarding_guide", "true");
    setOnBoard(false);
    setAccessPopup(true);
  };
  return (
    <Popup onClose={() => setOnBoard(false)} open={onBoardOpen}>
      <div className="pb-6 px-10 text-center">
        {Icon && (
          <Icon className="text-center bg-teal-900 size-14 p-2 rounded-full text-gray-300 mx-auto my-4 text-5xl" />
        )}

        <p className="text-2xl font-semibold">{current?.title}</p>
        <p className="text-center mt-4 text-md text-gray-600">
          {current?.description}
        </p>
        <div className="flex space-x-3 items-center">
          <Button
            type="button"
            variant="secondary"
            className="w-full bg-transparent border-0 text-gray-600 hover:underline p-0 shadow-none rounded-lg py-2"
            onClick={() => {
              setStep((prev) => prev - 1);
              localStorage.setItem("onboarding_state", `${step}`);
            }}
          >
            Back
          </Button>

          <Button
            type="button"
            variant="primary"
            className="w-full my-6 bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
            onClick={() => {
              setStep((prev) => prev + 1),
                localStorage.setItem("onboarding_state", `${step}`);
            }}
          >
            {step === OnboardingSteps.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    </Popup>
  );
};

export default OnboardingFlowGuide;
