import { Separator } from "@/components/ui/separator";
import SettingsQst from "@/components/SettingsQst";
import LocaleLink from "@/components/Locales/LocaleLink";
import AjouterUnRole from "@/components/AjouterUnRole";
import { getTranslations } from "next-intl/server";
import AddNews from "@/components/AddNews";
import SettingMessages from "@/components/SettingMessages";
import auth from "@/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import AccessDenied from "@/components/AccessDenied";

const page = async () => {
  const session = await getServerSession(auth);
  const userRole = session?.user?.roleid;

  if (userRole !== 3 && userRole !== 2) {
    return <AccessDenied />;
  }

  const t = await getTranslations("parametres");

  return (
    <div className=" motion-preset-focus motion-duration-2000">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1 m-8 w-full">
          <div className="text-3xl font-bold text-primary text-center md:ltr:text-left md:rtl:text-right">
            {t("parametres")}
          </div>
          <div className="text-xs text-gray-500 md:w-[50%] text-center md:ltr:text-left md:rtl:text-right">
            {t("parametresDesc")}
          </div>
        </div>
        <div className="md:hidden">
          <LocaleLink locale="en" label="en" />
          <LocaleLink locale="fr" label="fr" />
          <LocaleLink locale="ar" label="ar" />
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex justify-center w-full ">
        <div className="flex flex-col md:w-1/2 ">
          <SettingMessages />
          <SettingsQst />
          <AddNews />
          {/*<Separator className="my-8" />

          <div>
            <div className=" text-xl font-semibold text-primary">
              {t("ajouterUnRole")}
            </div>

            <AjouterUnRole />
          </div>*/}
        </div>
      </div>
    </div>
  );
};

export default page;
