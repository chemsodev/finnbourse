"use client";
import InfoDialog from "@/components/InfoDialog";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

const Page = () => {
  const t = useTranslations("MarchePrimaire");

  return (
    <div className=" motion-preset-focus motion-duration-2000">
      <Link
        href="/passerunordre"
        className="flex gap-2 items-center border rounded-md py-1 px-2 bg-primary text-white w-fit absolute md:mt-10"
      >
        <ArrowLeft className="w-5" /> <div>{t("back")}</div>
      </Link>
      <div className="flex justify-center text-3xl font-bold text-primary m-12 text-center md:ltr:text-left md:rtl:text-right">
        {t("marchePrimaire")}
      </div>
      <div className="flex justify-center">
        <div className="flex flex-row justify-center gap-8 md:gap-12 flex-wrap">
          <div className="w-52 h-52 rounded-md bg-gray-100 shadow-inner flex justify-center items-center group hover:bg-primary hover:text-white hover:drop-shadow-md flex-col  cursor-pointer gap-2">
            <div className="block group-hover:hidden h-5"></div>
            <div className="hidden group-hover:flex ltr:justify-end w-full mr-8">
              <InfoDialog title={t("opv")} text={[t("opvDesc")]} />
            </div>
            <Link
              href="/passerunordre/marcheprimaire/opv"
              className="flex flex-col gap-3 w-full h-36"
            >
              <div className="font-bold text-lg text-primary group-hover:text-white text-center">
                {t("opv")}
              </div>
              <div className="flex justify-center">
                <svg
                  viewBox="0 -0.5 17 17"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  className="w-20 h-20 fill-current text-primary group-hover:text-white"
                >
                  <path
                    d="M16,14.051 L1.885,14.051 L1.885,0.084 L0.041,0.084 L0,15.875 L0.041,15.875 L0.041,15.916 L16,15.875 L16,14.051 Z"
                    className="si-glyph-fill"
                  ></path>
                  <path
                    d="M15.816,2 L12.089,2 C12.017,2 11.96,2.059 11.96,2.129 L13.487,3.662 L10.011,8.125 L7,6 L3.027,11.188 L3.089,12.938 L7.061,8 L10.01,10 L14.37,4.551 L15.813,6 C15.884,6 15.942,5.941 15.942,5.871 L15.942,2.129 C15.945,2.059 15.888,2 15.816,2 L15.816,2 Z"
                    className="si-glyph-fill"
                  ></path>
                </svg>
              </div>
            </Link>
          </div>
          <div className="w-52 h-52 rounded-md bg-gray-100 shadow-inner flex justify-center items-center group hover:bg-primary hover:text-white hover:drop-shadow-md flex-col  cursor-pointer gap-2">
            <div className="block group-hover:hidden h-5"></div>
            <div className="hidden group-hover:flex ltr:justify-end w-full mr-8">
              <InfoDialog
                title={t("empruntObligataire")}
                text={[t("eoDesc")]}
              />
            </div>
            <Link
              href="/passerunordre/marcheprimaire/empruntobligataire"
              className="flex flex-col gap-3 w-full h-36 "
            >
              <div className="font-bold text-lg text-primary group-hover:text-white  text-center">
                {t("empruntObligataire")}
              </div>
              <div className="flex justify-center">
                <svg
                  viewBox="0 0 96 96"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-28 h-28 fill-current text-primary group-hover:text-white"
                >
                  <g data-name="Payment History" id="Payment_History">
                    <path d="M34,48.5A6.5,6.5,0,1,0,40.5,42,6.51,6.51,0,0,0,34,48.5Zm12,0A5.5,5.5,0,1,1,40.5,43,5.51,5.51,0,0,1,46,48.5Z" />
                    <path d="M55,48.5A2.5,2.5,0,1,0,52.5,51,2.5,2.5,0,0,0,55,48.5ZM52.5,50A1.5,1.5,0,1,1,54,48.5,1.5,1.5,0,0,1,52.5,50Z" />
                    <path d="M25,48.5A2.5,2.5,0,1,0,27.5,46,2.5,2.5,0,0,0,25,48.5Zm4,0A1.5,1.5,0,1,1,27.5,47,1.5,1.5,0,0,1,29,48.5Z" />
                    <path d="M16.5,31a.5.5,0,0,0,.5-.5V27H64v3.5a.5.5,0,0,0,1,0v-4a.5.5,0,0,0-.5-.5h-48a.5.5,0,0,0-.5.5v4A.5.5,0,0,0,16.5,31Z" />
                    <path d="M20.5,25a.5.5,0,0,0,.5-.5V21H60v3.5a.5.5,0,0,0,1,0v-4a.5.5,0,0,0-.5-.5h-40a.5.5,0,0,0-.5.5v4A.5.5,0,0,0,20.5,25Z" />
                    <path d="M69.5,46A14.54,14.54,0,0,0,55.26,57.9L54,55.28a.5.5,0,0,0-.9.44l2,4,0,0,0,0a.39.39,0,0,0,.1.08l.06,0a.55.55,0,0,0,.24.07h0a.52.52,0,0,0,.43-.21L59.8,56.9a.5.5,0,0,0-.6-.8l-3,2.26a13.49,13.49,0,1,1,.54,6.48.51.51,0,0,0-.64-.31.5.5,0,0,0-.31.63A14.5,14.5,0,1,0,69.5,46Z" />
                    <path d="M68.5,52a.5.5,0,0,0-.5.5v10a0,0,0,0,0,0,0,.44.44,0,0,0,0,.1.29.29,0,0,0,0,.09l0,.07a.27.27,0,0,0,.07.08l0,0,5,4a.51.51,0,0,0,.31.11.48.48,0,0,0,.39-.19.5.5,0,0,0-.08-.7L69,62.26V52.5A.5.5,0,0,0,68.5,52Z" />
                    <path d="M49.5,63H13V34H68v9.55a.5.5,0,0,0,1,0v-10a.5.5,0,0,0-.5-.5h-56a.5.5,0,0,0-.5.5v30a.5.5,0,0,0,.5.5h37a.5.5,0,0,0,0-1Z" />
                    <path d="M50.16,58H21.09A3.63,3.63,0,0,0,18,54.91V42.09A3.63,3.63,0,0,0,21.09,39H58.91A3.63,3.63,0,0,0,62,42.09v2.69a.5.5,0,0,0,1,0V41.63a.5.5,0,0,0-.5-.5,2.63,2.63,0,0,1-2.63-2.63.5.5,0,0,0-.5-.5H20.63a.5.5,0,0,0-.5.5,2.63,2.63,0,0,1-2.63,2.63.5.5,0,0,0-.5.5V55.37a.5.5,0,0,0,.5.5,2.63,2.63,0,0,1,2.63,2.63.5.5,0,0,0,.5.5H50.16a.5.5,0,0,0,0-1Z" />
                  </g>
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div
          className="rounded-md border border-gray-100 mt-12 md:w-[70%] p-8 flex flex-col gap-4 text-gray-500
      "
        >
          <div>{t("descMp")}</div>
          <ul className=" list-disc ml-6 mb-2">
            <li> {t("li1mp")}</li>
            <li> {t("li2mp")}</li>
            <li> {t("li3mp")}</li>
            <li> {t("li4mp")}</li>
          </ul>
          <div>{t("descMp2")}</div>
        </div>
      </div>
    </div>
  );
};

export default Page;
