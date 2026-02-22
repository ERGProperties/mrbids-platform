interface Props {
  currentStep: number;
  totalSteps: number;
}

export default function StepProgress({
  currentStep,
  totalSteps,
}: Props) {
  const percent = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8">
      <p className="text-sm text-gray-600 mb-2">
        Step {currentStep} of {totalSteps}
      </p>

      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-black h-2 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
