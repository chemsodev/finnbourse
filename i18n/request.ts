import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // Wait for the request locale
  const locale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(locale as any)) notFound();

  return {
    locale: locale, // Explicitly return the locale as required in next-intl 3.22+
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: "UTC",
  };
});
