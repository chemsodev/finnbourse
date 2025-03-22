import { Button } from "./ui/button";
import { CheckIcon, CircleAlert } from "lucide-react";
import { useSession } from "next-auth/react";
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import { UPDATE_ORDER_PAYED_WITH_CARD } from "@/graphql/mutations";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import TermsAndConditions from "./TermsAndConditions";
import { useState } from "react";

interface PayButtonProps {
  createdOrdreId: string;
  payedWithCard: boolean;
  setpayedWithCard: (value: boolean) => void;
  setPaymentData: (value: React.ReactNode) => void;
}

const PayButton: React.FC<PayButtonProps> = ({
  createdOrdreId,
  payedWithCard,
  setpayedWithCard,
  setPaymentData,
}) => {
  const session = useSession();
  const { toast } = useToast();
  const t = useTranslations("FormPassationOrdre");
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const handleTermsChange = (value: boolean) => {
    setIsTermsAccepted(value);
  };

  return (
    <>
      <div className="w-full flex gap-6 items-center justify-center mb-4">
        <TermsAndConditions onChange={handleTermsChange} />
      </div>
      <Button
        disabled={payedWithCard || !isTermsAccepted}
        type="button"
        className="w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-2 px-4 rounded shadow-md transition-colors duration-200"
        onClick={async () => {
          if (payedWithCard || !isTermsAccepted) return;
          const token = session.data?.user.token;
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
          const url = `${backendUrl}/satim-payment/register`;
          try {
            const response = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                orderId: createdOrdreId,
                jsonParams: {},
              }),
            });

            const responseData = await response.json();
            const formUrl = responseData.formUrl;
            if (responseData.error) {
              toast({
                variant: "destructive",
                action: (
                  <div className="w-full flex gap-6 items-center">
                    <CircleAlert size={40} />
                    <span className="first-letter:capitalize text-xs">
                      ${responseData.message}
                    </span>
                  </div>
                ),
              });
              return;
            }
            const popupWindow = window.open(
              formUrl,
              "_blank",
              "width=600,height=800"
            );
            if (popupWindow) {
              popupWindow.focus();
              console.log("started listening");

              const messageListener = async (event: MessageEvent) => {
                console.log(event.data);
                const EventData = JSON.parse(event.data);
                if (event.origin == process.env.NEXT_PUBLIC_BACKEND_URL) {
                  if (EventData.event === "success") {
                    // here add the UPDATE_ORDER_PAYED_WITH_CARD mutation
                    try {
                      await fetchGraphQL(UPDATE_ORDER_PAYED_WITH_CARD, {
                        id: createdOrdreId,
                        payedwithcard: true,
                      });
                      setpayedWithCard(true);
                      setPaymentData(
                        <div className="w-full flex gap-6 items-center">
                          <CheckIcon size={40} />
                          <span className="first-letter:capitalize text-xs">
                            {t("paymentSuccess")}
                          </span>
                        </div>
                      );
                      window.removeEventListener("message", messageListener);
                    } catch (error) {
                      console.error(
                        "Failed to update order payed with card",
                        error
                      );
                      toast({
                        variant: "destructive",
                        action: (
                          <div className="w-full flex gap-6 items-center">
                            <CircleAlert size={40} />
                            <span className="first-letter:capitalize text-xs">
                              Failed to update order payed with card.
                            </span>
                          </div>
                        ),
                      });
                    }
                  }
                }
              };
              window.addEventListener("message", messageListener);
            } else {
              toast({
                variant: "destructive",
                action: (
                  <div className="w-full flex gap-6 items-center">
                    <CircleAlert size={40} />
                    <span className="first-letter:capitalize text-xs">
                      Failed to open payment window. Please check your popup
                      blocker settings.
                    </span>
                  </div>
                ),
              });
            }
          } catch (error) {
            console.error("Payment error", error);
            toast({
              variant: "destructive",
              action: (
                <div className="w-full flex gap-6 items-center">
                  <CircleAlert size={40} />
                  <span className="first-letter:capitalize text-xs">
                    Payment failed. Please try again.
                  </span>
                </div>
              ),
            });
          }
        }}
      >
        <img
          src="/cib-dahabiya.png"
          alt="CIB Dahabiya"
          className="w-[50px] h-[35px] mr-4 object-contain"
        />
        {t("SatimPaymentbutton")}
      </Button>
    </>
  );
};

export default PayButton;
