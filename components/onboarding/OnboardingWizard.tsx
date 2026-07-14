"use client";

import { useState } from "react";

import UsernameStep from "./UsernameStep";

export default function OnboardingWizard() {
  const [step, setStep] = useState(1);

  return (
    <>
      {step === 1 && (
        <UsernameStep
          onContinue={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <div className="space-y-6 text-center">

          <h2 className="text-3xl font-bold">
            Step 2
          </h2>

          <p className="text-gray-500">
            Profile Photo coming next...
          </p>

        </div>
      )}
    </>
  );
}