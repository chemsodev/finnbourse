"use client";

import { UserRoleFormExample } from "@/components/UserRoleFormExample";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AGENCY_ROLES, CLIENT_ROLES, IOB_ROLES, TCC_ROLES } from "@/lib/roles";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RolesPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Système de Gestion des Rôles</h1>
      <p className="text-gray-600">
        Cette page présente le nouveau système de gestion des rôles pour
        différents types d'utilisateurs dans l'application.
      </p>

      <Tabs defaultValue="usage">
        <TabsList>
          <TabsTrigger value="usage">Guide d'utilisation</TabsTrigger>
          <TabsTrigger value="demo">Démo</TabsTrigger>
          <TabsTrigger value="roles">Liste des rôles</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Comment utiliser le système de rôles</CardTitle>
              <CardDescription>
                Guide d'implémentation pour les développeurs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">1. Import des rôles</h3>
                <pre className="bg-slate-100 rounded p-4 overflow-x-auto">
                  {`import { AGENCY_ROLES, CLIENT_ROLES, IOB_ROLES, TCC_ROLES } from "@/lib/roles";
import { getRolesByUserTypeString } from "@/lib/role-utils";

// Pour obtenir les rôles par type d'utilisateur
const roles = getRolesByUserTypeString("agency"); // AGENCY_ROLES`}
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-medium">
                  2. Utilisation du sélecteur de rôle unique
                </h3>
                <pre className="bg-slate-100 rounded p-4 overflow-x-auto">
                  {`import { RoleSelector } from "@/components/RoleSelector";

// Pour un sélecteur simple
<RoleSelector
  roles={AGENCY_ROLES}
  value={userRole}
  onChange={setUserRole}
  userType="agency"
  legacyMode={true} // Utiliser pour la compatibilité avec l'ancien format de rôles
/>`}
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-medium">
                  3. Utilisation de l'attribution de plusieurs rôles
                </h3>
                <pre className="bg-slate-100 rounded p-4 overflow-x-auto">
                  {`import { RolesAssignment } from "@/components/RolesAssignment";

// Pour une interface d'attribution de rôles multiples
<RolesAssignment
  selectedRoles={userRoles}
  onRolesChange={setUserRoles}
  userTypes={["agency"]} // Types d'utilisateurs à afficher
  showTabs={false} // Masquer les onglets si un seul type
/>`}
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-medium">
                  4. Utilisation dans un formulaire React Hook Form
                </h3>
                <pre className="bg-slate-100 rounded p-4 overflow-x-auto">
                  {`import { FormRoleSelector } from "@/components/RoleSelector";

// Dans un formulaire
<FormField
  control={form.control}
  name="role"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Rôle</FormLabel>
      <FormControl>
        <FormRoleSelector
          control={form.control}
          name="role"
          roles={getRolesByUserTypeString(userType)}
          label="Rôle"
          placeholder="Sélectionner un rôle"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>`}
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-medium">
                  5. Compatibilité avec l'ancien système
                </h3>
                <p>
                  Pour assurer la compatibilité avec l'ancien système de rôles,
                  vous pouvez utiliser les fonctions utilitaires:
                </p>
                <pre className="bg-slate-100 rounded p-4 overflow-x-auto">
                  {`import { mapLegacyRoleToNewRole, mapNewRoleToLegacyRole } from "@/lib/role-utils";

// Convertir un ancien rôle vers le nouveau format
const newRoleId = mapLegacyRoleToNewRole("initiator", "agency"); // "agency_order_declarer"

// Convertir un nouveau rôle vers l'ancien format
const legacyRole = mapNewRoleToLegacyRole("agency_order_declarer"); // "initiator"`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demo">
          <UserRoleFormExample />
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rôles Client</CardTitle>
              <CardDescription>
                Rôles disponibles pour les utilisateurs clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                {CLIENT_ROLES.map((role) => (
                  <li key={role.id} className="space-y-1">
                    <span className="font-medium">
                      {role.label} ({role.id})
                    </span>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rôles Agence</CardTitle>
              <CardDescription>
                Rôles disponibles pour les utilisateurs d'agence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                {AGENCY_ROLES.map((role) => (
                  <li key={role.id} className="space-y-1">
                    <span className="font-medium">
                      {role.label} ({role.id})
                    </span>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rôles TCC</CardTitle>
              <CardDescription>
                Rôles disponibles pour les utilisateurs TCC
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                {TCC_ROLES.map((role) => (
                  <li key={role.id} className="space-y-1">
                    <span className="font-medium">
                      {role.label} ({role.id})
                    </span>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rôles IOB</CardTitle>
              <CardDescription>
                Rôles disponibles pour les utilisateurs IOB
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                {IOB_ROLES.map((role) => (
                  <li key={role.id} className="space-y-1">
                    <span className="font-medium">
                      {role.label} ({role.id})
                    </span>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
