import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslations } from "next-intl";

interface TermsAndConditionsProps {
  onChange: (value: boolean) => void;
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  onChange,
}) => {
  const t = useTranslations("TermsAndConditions");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
    onChange(termsAccepted && token !== null);
  };

  const handleTermsChange = (checked: boolean) => {
    setTermsAccepted(checked);
    onChange(checked && captchaToken !== null);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="terms"
          className="h-4 w-4 rounded border-gray-300 text-primary ring-offset-background focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 peer-focus:ring-2 peer-focus:ring-offset-2"
          onChange={(e) => handleTermsChange(e.target.checked)}
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
        >
          {t("acceptTerms")}
        </label>
      </div>
      <div className="w-full">
        <ReCAPTCHA
          sitekey="6LdCkPMqAAAAADafbnY4TpPH_F18Jt5GzimBw8KY"
          onChange={handleCaptchaChange}
          size="normal"
          className="w-full"
        />
      </div>
    </form>
  );
};

export default TermsAndConditions;
