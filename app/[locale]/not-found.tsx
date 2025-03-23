import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <>
      <section className="bg-white ">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <div className="flex justify-center">
              <Image src="/favicon.ico" alt="logo" width={150} height={150} />
            </div>
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary ">
              404
            </h1>
            <div className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl ">
              {t("title")}
            </div>
            <div className="mb-4 text-lg font-light text-gray-500 ">
              {t("description")}
            </div>
            <Link
              href="/"
              className="inline-flex text-white bg-secondary   font-medium rounded-md text-sm px-5 py-2.5 text-center my-4"
            >
              {t("goHome")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
