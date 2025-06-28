"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import { RolesAssignment } from "@/components/RolesAssignment";

// User creation schema
const userCreationSchema = z
  .object({
    // Basic information
    fullname: z.string().min(2, "Nom complet requis"),
    email: z.string().email("Email invalide"),
    phonenumber: z.string().min(10, "Numéro de téléphone requis"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string().min(8, "Confirmation de mot de passe requise"),

    // Role and type
    roleid: z.number().min(1, "Rôle requis"),
    userType: z.string().optional(),

    // Personal information
    address: z.string().optional(),
    birthdate: z.string().optional(),
    nationality: z.string().optional(),
    countryofresidence: z.string().optional(),
    countryofbirth: z.string().optional(),
    profession: z.string().optional(),
    zipcode: z.string().optional(),

    // IOB specific fields
    position: z.string().optional(),
    matricule: z.string().optional(),
    organisation: z.string().optional(),

    // TCC specific fields
    positionTcc: z.string().optional(),

    // Agence specific fields
    agenceCode: z.string().optional(),

    // Client specific fields
    wilaya: z.string().optional(),
    idNumber: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type UserCreationFormValues = z.infer<typeof userCreationSchema>;

const USER_TYPES = [
  { value: 1, label: "Investisseur (Client)" },
  { value: 2, label: "IOB" },
  { value: 3, label: "TCC" },
  { value: 4, label: "Agence" },
];

const USER_TYPE_OPTIONS = {
  1: [
    { value: "proprietaire", label: "Propriétaire" },
    { value: "mandataire", label: "Mandataire" },
    { value: "tuteur_legal", label: "Tuteur Légal" },
  ],
  2: [
    { value: "admin", label: "Administrateur" },
    { value: "member", label: "Membre" },
    { value: "viewer", label: "Consulteur" },
  ],
  3: [
    { value: "admin", label: "Administrateur" },
    { value: "member", label: "Membre" },
  ],
  4: [
    { value: "admin", label: "Administrateur" },
    { value: "member", label: "Membre" },
  ],
};

export default function CreateUserPage() {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("UtilisateursPage");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const form = useForm<UserCreationFormValues>({
    resolver: zodResolver(userCreationSchema),
    defaultValues: {
      fullname: "",
      email: "",
      phonenumber: "",
      password: "",
      confirmPassword: "",
      roleid: 1,
      userType: "",
      address: "",
      birthdate: "",
      nationality: "",
      countryofresidence: "",
      countryofbirth: "",
      profession: "",
      zipcode: "",
      position: "",
      matricule: "",
      organisation: "",
      positionTcc: "",
      agenceCode: "",
      wilaya: "",
      idNumber: "",
    },
  });

  const selectedRoleId = form.watch("roleid");

  const onSubmit = async (values: UserCreationFormValues) => {
    try {
      // Here you would make an API call to create the user
      console.log("Creating user:", values);

      toast({
        title: "Utilisateur créé",
        description: "L'utilisateur a été créé avec succès",
        variant: "default",
      });

      // Redirect back to users list
      router.push("/utilisateurs");
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de l'utilisateur",
        variant: "destructive",
      });
    }
  };

  const renderRoleSpecificFields = () => {
    switch (selectedRoleId) {
      case 1: // Client/Investisseur
        return (
          <>
            <FormField
              control={form.control}
              name="userType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type d'utilisateur</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type d'utilisateur" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {USER_TYPE_OPTIONS[1].map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="wilaya"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wilaya</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Entrer la wilaya" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro d'identité</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Entrer le numéro d'identité"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );

      case 2: // IOB
        return (
          <>
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Entrer la position" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="matricule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matricule</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Entrer le matricule" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organisation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organisation</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Entrer l'organisation" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );

      case 3: // TCC
        return (
          <>
            <FormField
              control={form.control}
              name="positionTcc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position TCC</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Entrer la position TCC" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="matricule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matricule</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Entrer le matricule" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );

      case 4: // Agence
        return (
          <>
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Entrer la position" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="agenceCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code Agence</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Entrer le code agence" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-8 bg-slate-100 p-4 rounded-md">
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Créer un nouvel utilisateur</h1>
          <p className="text-gray-600 text-sm">
            Remplissez les informations pour créer un nouvel utilisateur
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations de l'utilisateur</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom complet *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Entrer le nom complet" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Entrer l'email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phonenumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Entrer le numéro de téléphone"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="roleid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type d'utilisateur *</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {USER_TYPES.map((type) => (
                            <SelectItem
                              key={type.value}
                              value={type.value.toString()}
                            >
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Entrer le mot de passe"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmer le mot de passe *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirmer le mot de passe"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Role-specific fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderRoleSpecificFields()}
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Informations supplémentaires
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Entrer l'adresse" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birthdate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date de naissance</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nationalité</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Entrer la nationalité"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="profession"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profession</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Entrer la profession"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Roles Assignment for IOB and TCC users */}
              {(selectedRoleId === 2 || selectedRoleId === 3) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Attribution des rôles</h3>
                  <RolesAssignment
                    selectedRoles={selectedRoles}
                    onRolesChange={setSelectedRoles}
                    userTypes={selectedRoleId === 2 ? ["iob"] : ["tcc"]}
                    showTabs={false}
                  />
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end space-x-2 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Annuler
                </Button>
                <Button type="submit">Créer l'utilisateur</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
