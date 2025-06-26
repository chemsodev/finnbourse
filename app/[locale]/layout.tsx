import type { Metadata } from "next";
import "./globals.css";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import SessionWrapper from "@/components/SessionWrapper";
import { Toaster } from "@/components/ui/toaster";
import DebugInitializer from "@/components/DebugInitializer";
import ErrorBoundary from "@/components/ErrorBoundary";
import MenuFetchInitializer from "@/components/MenuFetchInitializer";

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
          <ErrorBoundary>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <DebugInitializer />
              <MenuFetchInitializer />
              {children}
              <Toaster />
            </NextIntlClientProvider>
          </ErrorBoundary>
        </body>
      </html>
    </SessionWrapper>
  );
}
