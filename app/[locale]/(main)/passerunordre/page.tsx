import auth from "@/auth";
import InfoDialog from "@/components/InfoDialog";
import MyMarquee from "@/components/MyMarquee";
import { Link } from "@/i18n/routing";
import { getServerSession } from "next-auth/next";
import React from "react";
import { getTranslations } from "next-intl/server";
import IPOAnnouncement from "@/components/dashboard/IPOAnnouncement";

const page = async () => {
  const t = await getTranslations("PasserUnOrdre");
  const ipoT = await getTranslations("IPOAnnouncement");
  const dateTime = new Date();
  const session = await getServerSession(auth);
  const userRole = (session as any)?.user?.roleid;

  // Example IPO data - replace with actual data from your API/database
  const ipoEndDate = new Date();
  ipoEndDate.setDate(ipoEndDate.getDate() + 7); // Set end date to 7 days from now

  return (
    <div className=" motion-preset-focus motion-duration-2000">
      <div className="mt-3 flex flex-col gap-4">
        <MyMarquee />
        <IPOAnnouncement
          companyName={ipoT("sonatrach")}
          endDate={ipoEndDate}
          description={ipoT("sonatrach_description")}
          actionUrl="/passerunordre/marcheprimaire/opv"
        />
      </div>{" "}
      <div className="flex justify-center text-3xl font-bold text-primary m-12 text-center md:ltr:text-left md:rtl:text-right">
        {t("passerunordre")}
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col md:flex-row justify-center gap-12">
          <div className="w-52 h-52 rounded-md bg-gray-100 shadow-inner flex justify-center items-center group hover:bg-primary hover:text-white hover:drop-shadow-md flex-col  cursor-pointer gap-2">
            <div className="block group-hover:hidden h-5"></div>
            <div className="hidden group-hover:flex ltr:justify-end w-full mr-8">
              <InfoDialog
                title={t("marcheprimaire")}
                text={[t("maintxtP"), t("li1P"), t("li2P"), t("li3P")]}
              />
            </div>
            <Link
              href="/passerunordre/marcheprimaire"
              className="flex flex-col gap-3 w-full h-36"
            >
              <div className="font-bold text-lg text-primary group-hover:text-white text-center">
                {t("marcheprimaire")}
              </div>
              <div className="flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="w-20 h-20 fill-current text-primary group-hover:text-white"
                >
                  <g>
                    <rect x="0" y="161.669" width="104.756" height="314.266" />
                    <path d="M313.498,245.524c-5.555,7.438-8.593,16.45-8.593,25.872c0,11.632,4.502,22.425,12.676,30.588c8.173,8.174,19.068,12.675,30.588,12.675c11.529,0,22.424-4.501,30.588-12.562c15.406-15.406,16.767-39.601,3.98-56.572H313.498z" />
                    <path d="M293.274,408.836v67.15H398.03v-65.268c-15.816,5.658-32.675,8.593-49.861,8.593C329.11,419.312,310.46,415.65,293.274,408.836z" />
                    <path d="M200.365,271.396c0-39.488,15.284-76.571,43.252-104.541c2.517-2.516,5.034-4.931,7.755-7.13V36.014H146.617v439.973h104.755v-92.818c-2.721-2.199-5.238-4.603-7.755-7.119C215.648,348.08,200.365,310.997,200.365,271.396z" />
                    <path d="M502.509,389.604l-56.521-55.058c12.051-18.638,18.577-40.346,18.577-63.109c0-31.14-12.102-60.377-34.066-82.341c-21.964-21.964-51.201-34.066-82.342-34.066c-31.14,0-60.388,12.102-82.341,34.066c-21.974,21.964-34.066,51.201-34.066,82.341c0,31.141,12.092,60.388,34.056,82.352c21.964,21.963,51.212,34.066,82.352,34.066c22.762,0,44.48-6.537,63.119-18.588l55.038,56.501c10.26,12.368,25.401,13.104,37.104,1.401C515.133,415.476,514.877,399.834,502.509,389.604z M348.158,333.912c-16.686,0-32.378-6.506-44.184-18.302c-11.794-11.794-18.291-27.488-18.291-44.173c0-16.684,6.497-32.367,18.291-44.163c11.806-11.796,27.489-18.302,44.184-18.302c16.675,0,32.368,6.506,44.163,18.302c24.358,24.358,24.358,63.989,0,88.346C380.526,327.416,364.843,333.912,348.158,333.912z" />
                  </g>
                </svg>
              </div>
            </Link>
          </div>
          <div className="w-52 h-52 rounded-md bg-gray-100 shadow-inner flex justify-center items-center group hover:bg-primary hover:text-white hover:drop-shadow-md flex-col  cursor-pointer gap-2">
            <div className="block group-hover:hidden h-5"></div>
            <div className="hidden group-hover:flex ltr:justify-end w-full mr-8">
              <InfoDialog
                title={t("marchesecondaire")}
                text={[t("maintxtS"), t("li1S"), t("li2S"), t("li3S")]}
              />
            </div>
            <Link
              href="/passerunordre/marchesecondaire"
              className="flex flex-col gap-3 w-full h-36 "
            >
              <div className="font-bold text-lg text-primary group-hover:text-white  text-center">
                {t("marchesecondaire")}
              </div>
              <div className="flex justify-center">
                <svg
                  version="1.1"
                  id="_x32_"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="w-20 h-20 fill-current text-primary group-hover:text-white"
                >
                  <g>
                    <path
                      d="M469.027,68.852c7.609,0,13.779-6.171,13.779-13.78V50.23c0-7.609-6.17-13.779-13.779-13.779H272.201V0H239.8v36.451H42.973
    c-7.609,0-13.78,6.17-13.78,13.779v4.842c0,7.609,6.171,13.78,13.78,13.78h10.521v230.857H42.973c-7.609,0-13.78,6.17-13.78,13.78
    v4.841c0,7.61,6.171,13.78,13.78,13.78h10.521H239.8v66.281l-55.527,61.891c-2.112-0.554-4.291-0.933-6.577-0.933
    c-14.54,0-26.326,11.786-26.326,26.326c0,14.539,11.786,26.326,26.326,26.326c14.539,0,26.325-11.787,26.325-26.326
    c0-3.291-0.676-6.408-1.78-9.31l54.463-60.705l52.861,61.322c-0.961,2.737-1.586,5.632-1.586,8.694c0,14.539,11.787,26.326,26.326,26.326
    c14.539,0,26.326-11.787,26.326-26.326c0-14.54-11.786-26.326-26.326-26.326c-2.512,0-4.892,0.467-7.191,1.123l-53.885-62.523
    l-0.621-0.016l0.621-0.688h-1.028V332.11h186.305h10.521c7.609,0,13.779-6.171,13.779-13.78v-4.841c0-7.61-6.17-13.78-13.779-13.78
    h-10.521V68.852H469.027z M77.795,299.709V68.852h356.411v230.857H77.795z"
                    />
                    <path
                      d="M359.895,105.745c-13.115,0-23.747,10.632-23.747,23.756c0,4.2,1.178,8.084,3.093,11.51l-57.303,66.249
    c-2.634-1.005-5.458-1.614-8.448-1.614c-2.08,0-4.066,0.356-5.988,0.854l-23.257-33.595c2.753-3.877,4.406-8.591,4.406-13.709
    c0-13.123-10.632-23.755-23.763-23.755c-13.124,0-23.755,10.632-23.755,23.755c0,3.599,0.854,6.969,2.286,10.022l-52.209,52.208
    c-3.053-1.432-6.423-2.286-10.022-2.286c-13.123,0-23.755,10.632-23.755,23.755s10.632,23.763,23.755,23.763
    c13.131,0,23.763-10.64,23.763-23.763c0-3.592-0.855-6.962-2.286-10.014l52.208-52.209c3.054,1.432,6.423,2.286,10.015,2.286
    c2.088,0,4.074-0.356,6.004-0.862l23.256,33.588c-2.753,3.876-4.414,8.591-4.414,13.717c0,13.123,10.632,23.763,23.755,23.763
    c13.131,0,23.763-10.64,23.763-23.763c0-4.201-1.178-8.085-3.093-11.51l57.287-66.25c2.634,1.013,5.466,1.622,8.448,1.622
    c13.131,0,23.763-10.64,23.763-23.763C383.658,116.377,373.027,105.745,359.895,105.745z"
                    />
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
          <div>{t("descpo")}</div>
          <ul className=" list-disc ml-6 mb-2">
            <li> {t("lipo1")}</li>
            <li> {t("lipo2")}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default page;
