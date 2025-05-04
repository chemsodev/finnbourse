import { getTranslations } from "next-intl/server"
import { getServerSession } from "next-auth"
import auth from "@/auth"
import MyMarquee from "@/components/MyMarquee"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SessionManagement from "@/components/bourse-sessions/session-management"
import SessionOrders from "@/components/bourse-sessions/session-orders"
import SessionStats from "@/components/bourse-sessions/session-stats"

export default async function BourseSessionsPage() {
  const session = await getServerSession(auth)
  const userRole = session?.user?.roleid

  // Only allow admin and negotiator roles to access this page
  if (userRole !== 2 && userRole !== 3) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Accès refusé</h1>
          <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        </div>
      </div>
    )
  }

  const t = await getTranslations("mesOrdres")

  return (
    <div className="motion-preset-focus motion-duration-2000">
      <div className="mt-3">
        <MyMarquee />
      </div>
      <div className="flex flex-col gap-1 mt-16 mb-8 ml-8">
        <div className="text-3xl font-bold text-primary text-center md:ltr:text-left md:rtl:text-right">
          Gestion des Sessions de Bourse
        </div>
        <div className="text-xs text-gray-500 md:w-[50%] text-center md:ltr:text-left md:rtl:text-right">
          Créez et gérez les sessions de bourse et assignez des ordres à chaque session
        </div>
      </div>

      <div className="border border-gray-100 rounded-md p-4 mt-10">
        <Tabs defaultValue="management" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="management">Sessions</TabsTrigger>
            <TabsTrigger value="orders">Assignation d'ordres</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
          </TabsList>
          <TabsContent value="management" className="mt-6">
            <SessionManagement />
          </TabsContent>
          <TabsContent value="orders" className="mt-6">
            <SessionOrders />
          </TabsContent>
          <TabsContent value="stats" className="mt-6">
            <SessionStats />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
