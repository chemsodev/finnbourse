import { Link } from "@/i18n/routing";
import clsx from "clsx";
import { useLocale } from "next-intl";

export default function LocaleLink({
  locale,
  label,
}: {
  locale: any;
  label: string;
}) {
  const curLocale = useLocale();

  return (
    <Link
      href="/"
      locale={locale}
      className={clsx(
        "w-8 h-8 text-lg cursor-pointer flex justify-center items-center text-gray-300 transition duration-300 ease-in-out hover:scale-125 capitalize",
        curLocale === locale &&
          "bg-primary text-white rounded-md shadow font-medium"
      )}
    >
      {label}
    </Link>
  );
}
