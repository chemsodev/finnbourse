import type { Metadata } from "next";
import "./globals.css";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import SessionWrapper from "@/components/SessionWrapper";
import { Toaster } from "@/components/ui/toaster";
import DebugInitializer from "@/components/DebugInitializer";
import TokenExpiredHandler from "@/components/TokenExpiredHandler";
export const metadata: Metadata = {
  title: "FinnBourse",
  description: "",
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  return (
    <SessionWrapper>
      <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
        {" "}
        <body>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <DebugInitializer />
            <TokenExpiredHandler />
            {children}
            <Toaster />
          </NextIntlClientProvider>
        </body>
      </html>
    </SessionWrapper>
  );
}
