interface Props {
  currentStep: number;
  totalSteps: number;
}

export default function StepProgress({
  currentStep,
  totalSteps,
}: Props) {
  const percent = Math.round(
    (currentStep / totalSteps) * 100
  );

  const getMomentumText = () => {
    if (percent < 30) {
      return "Getting started — let’s build your listing.";
    }

    if (percent < 70) {
      return "Nice progress — your listing is coming together.";
    }

    if (percent < 100) {
      return "Final stretch — you’re almost ready to publish.";
    }

    return "Complete — your listing is ready.";
  };

  const isFinalStep = currentStep === totalSteps;

  return (
    <div className="mb-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-gray-900">
          {percent}% complete
        </p>

        <p className="text-xs text-gray-500">
          Step {currentStep} of {totalSteps}
        </p>
      </div>

      {/* Momentum Message */}
      <p
        className={`text-sm mb-3 ${
          isFinalStep
            ? "text-black font-medium"
            : "text-gray-600"
        }`}
      >
        {isFinalStep
          ? "Final step — confirm and launch your listing."
          : getMomentumText()}
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-black h-2 transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

    </div>
  );
}