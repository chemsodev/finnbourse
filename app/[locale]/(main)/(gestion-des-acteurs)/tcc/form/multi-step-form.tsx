"use client";

import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiStepFormProps {
  steps: ReactNode[];
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
      <div className="relative">
        <nav aria-label="Progress" className="mb-8">
          <ol
            role="list"
            className="space-y-4 md:flex md:space-x-8 md:space-y-0"
          >
            {steps.map((step, index) => (
              <li key={index} className="md:flex-1">
                <div
                  className={cn(
                    "flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4",
                    currentStep > index
                      ? "border-primary"
                      : currentStep === index
                      ? "border-primary"
                      : "border-gray-200"
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-medium",
                      currentStep > index
                        ? "text-primary"
                        : currentStep === index
                        ? "text-primary"
                        : "text-gray-500"
                    )}
                  >
                    {t(`step${index + 1}`)}
                  </span>
                  <span
                    className={cn(
                      "text-sm",
                      currentStep >= index ? "text-gray-900" : "text-gray-500"
                    )}
                  >
                    {t(`stepTitle${index + 1}`)}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-6">{steps[currentStep]}</div>

        <div className="mt-8 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onPrevStep}
            disabled={isFirstStep || isSubmitting}
            className={isFirstStep ? "invisible" : ""}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("previous")}
          </Button>

          {isLastStep ? (
            <Button type="button" onClick={onSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner mr-2"></span>
                  {t("saving")}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {t("save")}
                </>
              )}
            </Button>
          ) : (
            <Button type="button" onClick={onNextStep} disabled={isSubmitting}>
              {t("next")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
