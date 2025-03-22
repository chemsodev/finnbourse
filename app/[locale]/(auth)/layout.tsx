import auth from "@/auth";
import { redirect } from "@/i18n/routing";
import { getServerSession } from "next-auth";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(auth);

  if (session) {
    redirect("/");
  }

  return <>{children}</>;
}
