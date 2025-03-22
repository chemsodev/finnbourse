import auth from "@/auth";
import { QstAccordion } from "@/components/QstAccordion";
import { SupportDialog } from "@/components/SupportDialog";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/routing";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import React from "react";
import { MdOutlineEmail, MdOutlineHeadsetMic } from "react-icons/md";
import AccessDenied from "@/components/AccessDenied";
import LocaleLink from "@/components/Locales/LocaleLink";

const page = async () => {
  const session = await getServerSession(auth);
  const userRole = session?.user?.roleid;

  if (userRole !== 1 && userRole !== 0) {
    return <AccessDenied />;
  }

  const t = await getTranslations("serviceclients");

  return (
    <div className=" motion-preset-focus motion-duration-2000">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1 m-8 w-full">
          <div className="text-3xl font-bold text-primary text-center md:ltr:text-left md:rtl:text-right">
            {t("title")}
          </div>
          <div className="text-xs text-gray-500 md:w-[50%] text-center md:ltr:text-left md:rtl:text-right">
            {t("description")}
          </div>
        </div>
        <div className="flex gap-2 bg-gray-100 shadow-inner h-fit rounded-md p-1 mr-4">
          <LocaleLink locale="en" label="en" />
          <LocaleLink locale="fr" label="fr" />
          <LocaleLink locale="ar" label="ar" />
        </div>
      </div>
      <div className="px-8">
        <Separator />
      </div>
      <div className="flex justify-center">
        <div className="w-[80%] md:w-[55%] mt-10 md:mt-20">
          <QstAccordion />
        </div>
      </div>
      <div className="flex justify-center">
        <SupportDialog />
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col  gap-4 md:w-[55%] mt-8">
          <Link
            href="mailto:contact@finnetude.com"
            className="flex w-full gap-4 border border-gray-100 rounded-md p-4"
          >
            <div className="w-14 h-14 shadow-inner bg-gray-50 rounded-md flex justify-center items-center">
              <MdOutlineEmail size={30} />
            </div>
            <div>
              <div className="md:text-lg font-semibold">{t("email")}</div>
              <div className="text-xs md:text-sm text-gray-500">
                {t("emailDescription")}
              </div>
            </div>
          </Link>
          <Link
            href="tel:+21266666666"
            className="flex w-full gap-4 border border-gray-100 rounded-md p-4"
          >
            <div className="w-14 h-14 shadow-inner bg-gray-50 rounded-md flex justify-center items-center">
              <MdOutlineHeadsetMic size={30} />
            </div>
            <div>
              <div className="md:text-lg font-semibold">{t("phone")}</div>
              <div className="text-xs md:text-sm text-gray-500">
                {t("phoneDescription")}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
