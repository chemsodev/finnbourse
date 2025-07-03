"use client";

import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

interface Step {
  title: string;
  content: ReactNode;
}

interface MultiStepFormProps {
  steps: Step[];
  currentStep: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isLastStep: boolean;
  isFirstStep: boolean;
}

export function MultiStepForm({
  steps,
  currentStep,
  onNextStep,
  onPrevStep,
  onSubmit,
  isSubmitting,
  isLastStep,
  isFirstStep,
}: MultiStepFormProps) {
  const t = useTranslations("MultiStepForm");

  return (
    <div className="space-y-8">
      {/* Step indicators */}
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <div
                className={`h-1 w-16 ${
                  index <= currentStep ? "bg-primary" : "bg-gray-200"
                }`}
              ></div>
            )}
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  index < currentStep
                    ? "bg-primary text-white border-primary"
                    : index === currentStep
                    ? "border-primary text-primary"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                {index < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={`mt-1 text-xs ${
                  index <= currentStep ? "text-primary" : "text-gray-500"
                }`}
              >
                {step.title}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Current step content */}
      <div>{steps[currentStep].content}</div>

      {/* Navigation buttons */}
      <div className="flex justify-end gap-2">
        {!isFirstStep && (
          <Button
            type="button"
            variant="outline"
            onClick={onPrevStep}
            disabled={isSubmitting}
          >
            {t("previous")}
          </Button>
        )}
        {isLastStep ? (
          <Button type="button" onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? t("saving") : t("save")}
          </Button>
        ) : (
          <Button type="button" onClick={onNextStep} disabled={isSubmitting}>
            {t("next")}
          </Button>
        )}
      </div>
    </div>
  );
}
