"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormRoleSelector } from "@/components/RoleSelector";
import { AGENCY_ROLES, CLIENT_ROLES, IOB_ROLES, TCC_ROLES } from "@/lib/roles";
import { getRolesByUserTypeString } from "@/lib/role-utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { RolesAssignment, RolesChipSelect } from "./RolesAssignment";

const userFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  role: z.string().min(1, {
    message: "Please select a role.",
  }),
  // Multiple roles can be selected
  roles: z.array(z.string()).optional(),
  userType: z.string().min(1, {
    message: "Please select a user type.",
  }),
});

type UserFormValues = z.infer<typeof userFormSchema>;

export function UserRoleFormExample() {
  const [selectedUserType, setSelectedUserType] = useState<string>("client");
  const [multipleRoles, setMultipleRoles] = useState<string[]>([]);

  // Default values for the form
  const defaultValues: Partial<UserFormValues> = {
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    roles: [],
    userType: "client",
  };

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
  });

  function onSubmit(data: UserFormValues) {
    // Add multiple roles to the data if using multiple roles selection
    const dataWithRoles = {
      ...data,
      roles: multipleRoles,
    };

    console.log(dataWithRoles);
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Exemple de gestion des rôles</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="single" className="mb-8">
          <TabsList>
            <TabsTrigger value="single">Rôle unique</TabsTrigger>
            <TabsTrigger value="multiple">Rôles multiples</TabsTrigger>
          </TabsList>
          <TabsContent value="single">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom</FormLabel>
                        <FormControl>
                          <Input placeholder="Jean" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input placeholder="Dupont" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="exemple@domaine.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="userType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type d'utilisateur</FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {["client", "agency", "tcc", "iob"].map((type) => (
                          <Button
                            key={type}
                            type="button"
                            variant={
                              field.value === type ? "default" : "outline"
                            }
                            onClick={() => {
                              field.onChange(type);
                              setSelectedUserType(type);
                              // Reset role when type changes
                              form.setValue("role", "");
                            }}
                          >
                            {type === "client"
                              ? "Client"
                              : type === "agency"
                              ? "Agence"
                              : type === "tcc"
                              ? "TCC"
                              : "IOB"}
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                          roles={getRolesByUserTypeString(selectedUserType)}
                          label="Rôle"
                          placeholder="Sélectionner un rôle"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Enregistrer</Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="multiple">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Prénom</label>
                  <Input placeholder="Jean" />
                </div>
                <div>
                  <label className="text-sm font-medium">Nom</label>
                  <Input placeholder="Dupont" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="exemple@domaine.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Type d'utilisateur
                </label>
                <div className="flex flex-wrap gap-2">
                  {["client", "agency", "tcc", "iob"].map((type) => (
                    <Button
                      key={type}
                      type="button"
                      variant={
                        selectedUserType === type ? "default" : "outline"
                      }
                      onClick={() => {
                        setSelectedUserType(type);
                        setMultipleRoles([]);
                      }}
                    >
                      {type === "client"
                        ? "Client"
                        : type === "agency"
                        ? "Agence"
                        : type === "tcc"
                        ? "TCC"
                        : "IOB"}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rôles</label>
                <RolesAssignment
                  selectedRoles={multipleRoles}
                  onRolesChange={setMultipleRoles}
                  userTypes={[selectedUserType]}
                  showTabs={false}
                />
              </div>
              <Button onClick={() => console.log({ multipleRoles })}>
                Enregistrer
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
