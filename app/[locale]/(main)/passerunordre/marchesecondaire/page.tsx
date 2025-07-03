import InfoDialog from "@/components/InfoDialog";
import MyMarquee from "@/components/MyMarquee";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { FaRegHandshake } from "react-icons/fa6";
import { MdOutlineMosque } from "react-icons/md";

const page = () => {
  const t = useTranslations("MarcheSecondaire");

  return (
    <div className=" motion-preset-focus motion-duration-2000">
      <div className="mt-3">
        <MyMarquee />
      </div>
      <Link
        href="/passerunordre"
        className="flex gap-2 items-center border rounded-md py-1 px-2 bg-primary text-white w-fit absolute md:mt-10"
      >
        <ArrowLeft className="w-5" /> <div>{t("back")}</div>
      </Link>
      <div className="flex justify-center text-3xl font-bold text-primary m-12 text-center md:ltr:text-left md:rtl:text-right">
        {t("marcheSecondaire")}
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col md:flex-row justify-center gap-12">
          <div className="w-52 h-52 rounded-md bg-gray-100 shadow-inner flex justify-center items-center group hover:bg-primary hover:text-white hover:drop-shadow-md flex-col  cursor-pointer gap-2">
            <div className="block group-hover:hidden h-5"></div>
            <div className="hidden group-hover:flex ltr:justify-end w-full mr-8">
              <InfoDialog title={t("action")} text={[t("actionDesc")]} />
            </div>
            <Link
              href="/passerunordre/marchesecondaire/action"
              className="flex flex-col gap-3 w-full h-36"
            >
              <div className="font-bold text-lg text-primary group-hover:text-white text-center">
                {t("action")}
              </div>
              <div className="flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 192 192"
                  className="w-20 h-20 fill-current text-primary group-hover:text-white"
                >
                  <g fill="none">
                    <path
                      d="M22 142.576h10.702M22 114.712h10.702M22 22v148h148M21.995 32.934h10.702m-10.702 27.32h10.702M21.995 87.356h10.702"
                      className="stroke-primary group-hover:stroke-white"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeMiterlimit="6"
                    />
                    <path
                      d="M68.842 128.695a10.782 10.782 0 0 1-10.781 10.781 10.782 10.782 0 0 1-10.782-10.781 10.782 10.782 0 0 1 10.782-10.782 10.782 10.782 0 0 1 10.781 10.782zM95.06 76.358A10.782 10.782 0 0 1 84.277 87.14a10.782 10.782 0 0 1-10.782-10.782 10.782 10.782 0 0 1 10.782-10.782 10.782 10.782 0 0 1 10.781 10.782Zm43.576 36.396a10.782 10.782 0 0 1-10.782 10.781 10.782 10.782 0 0 1-10.781-10.781 10.782 10.782 0 0 1 10.781-10.782 10.782 10.782 0 0 1 10.782 10.782zm21.604-73.396a10.782 10.782 0 0 1-10.782 10.782 10.782 10.782 0 0 1-10.782-10.782 10.782 10.782 0 0 1 10.782-10.781 10.782 10.782 0 0 1 10.781 10.781z"
                      className="stroke-primary group-hover:stroke-white"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeMiterlimit="6"
                    />
                    <path
                      d="m64.38 118.198 14.117-31.362m15.08-2.424 24.333 21.124m13.668-4.067 15.53-52.393"
                      className="stroke-primary group-hover:stroke-white"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeMiterlimit="6"
                    />
                  </g>
                </svg>
              </div>
            </Link>
          </div>

          <div className="w-52 h-52 rounded-md bg-gray-100 shadow-inner flex justify-center items-center group hover:bg-primary hover:text-white hover:drop-shadow-md flex-col  cursor-pointer gap-2">
            <div className="block group-hover:hidden h-5"></div>
            <div className="hidden group-hover:flex ltr:justify-end w-full mr-8">
              <InfoDialog
                title={t("obligation")}
                text={[t("obligationDesc")]}
              />
            </div>
            <Link
              href="/passerunordre/marchesecondaire/obligation"
              className="flex flex-col gap-3 w-full h-36 "
            >
              <div className="font-bold text-lg text-primary group-hover:text-white  text-center">
                {t("obligation")}
              </div>
              <div className="flex justify-center">
                <svg
                  className="w-20 h-20 fill-current text-primary group-hover:text-white"
                  viewBox="0 0 512 512"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  fill="currentColor"
                >
                  <g>
                    <g>
                      <g>
                        <path
                          d="M437.403,129.686c-1.546-1.546-86.03-86.02-124.209-124.197C309.766,2.058,304.96,0,299.943,0h-212.1
          C77.498,0,69.111,8.387,69.111,18.732v474.537c0,10.345,8.387,18.732,18.732,18.732h336.314c10.345,0,18.732-8.387,18.732-18.732
          V142.932C442.889,138.069,440.834,133.115,437.403,129.686z M318.681,63.956c3.186,3.184,53.915,53.915,60.249,60.247h-60.249
          V63.956z M405.427,474.537H106.575V37.463h174.643v105.472c0,10.345,8.387,18.732,18.732,18.732h105.477V474.537z"
                        />
                        <path
                          d="M268.37,208.002c0-3.646-4.948-7.032-9.897-7.032c-5.729,0-9.897,3.385-9.897,7.032v7.292
          c-27.604,3.906-52.084,19.792-52.084,52.866c0,33.334,28.125,44.533,52.084,53.646v42.189
          c-19.271-3.385-28.125-18.75-39.063-18.75c-9.895,0-17.709,13.021-17.709,21.876c0,16.667,25.523,32.813,56.772,33.854v6.51
          c0,3.646,4.167,7.032,9.897,7.032c4.949,0,9.897-3.385,9.897-7.032v-7.551c30.469-4.948,51.304-24.48,51.304-56.772
          c0-35.157-27.604-47.397-51.304-56.251v-38.022c16.927,1.302,21.876,9.636,30.469,9.636c11.459,0,16.147-14.324,16.147-21.355
          c0-17.969-30.469-22.136-46.616-22.657V208.002z M251.183,280.66c-9.897-4.167-16.667-8.855-16.667-16.406
          c0-6.25,4.948-12.241,16.667-14.583V280.66z M281.652,347.328c0,9.375-7.032,14.322-15.887,16.406v-34.897
          C275.141,333.266,281.652,338.734,281.652,347.328z"
                        />
                        <path
                          d="M251.8,142.935c0-10.345-8.387-18.732-18.732-18.732h-78.345c-10.345,0-18.732,8.387-18.732,18.732
          s8.387,18.732,18.732,18.732h78.345C243.414,161.667,251.8,153.282,251.8,142.935z"
                        />
                      </g>
                    </g>
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
          <div>{t("descMs")}</div>
          <ul className=" list-disc ml-6 mb-2">
            <li> {t("li1ms")}</li>
            <li> {t("li2ms")}</li>
            <li> {t("li3ms")}</li>
            <li> {t("li4ms")}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default page;
