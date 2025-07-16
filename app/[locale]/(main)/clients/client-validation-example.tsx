"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { z } from "zod";

export function ClientValidationExample() {
  const [clientType, setClientType] = useState<"individual" | "company">(
    "individual"
  );
  const [formData, setFormData] = useState({
    // Common fields
    client_code: "",
    email: "",
    phone_number: "",
    address: "",
    wilaya: "",

    // Individual fields
    name: "",
    id_number: "",
    nin: "",
    nationalite: "",

    // Company fields
    raison_sociale: "",
    nif: "",
    reg_number: "",
    legal_form: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const t = useTranslations("ClientValidation");

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear the error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Define validation schema based on client type
  const getValidationSchema = () => {
    const baseSchema = z.object({
      client_code: z
        .string()
        .min(1, t("required", { field: t("client_code") })),
      email: z.string().email(t("invalidEmail")),
      phone_number: z
        .string()
        .min(1, t("required", { field: t("phone_number") })),
      wilaya: z.string().min(1, t("required", { field: t("wilaya") })),
      address: z.string().min(1, t("required", { field: t("address") })),
    });

    if (clientType === "individual") {
      return baseSchema.extend({
        name: z.string().min(1, t("required", { field: t("name") })),
        id_number: z.string().min(1, t("required", { field: t("id_number") })),
        nin: z.string().min(1, t("required", { field: t("nin") })),
        nationalite: z
          .string()
          .min(1, t("required", { field: t("nationality") })),
      });
    } else {
      return baseSchema.extend({
        raison_sociale: z
          .string()
          .min(1, t("required", { field: t("company_name") })),
        nif: z.string().min(1, t("required", { field: t("nif") })),
        reg_number: z
          .string()
          .min(1, t("required", { field: t("reg_number") })),
        legal_form: z
          .string()
          .min(1, t("required", { field: t("legal_form") })),
      });
    }
  };

  // Handle form submission with validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate using the schema based on client type
      const schema = getValidationSchema();
      schema.parse(formData);

      // If successful, show success message
      toast({
        title: "Form submitted successfully",
        description: "Your client has been validated",
      });

      console.log("Valid client data:", {
        ...formData,
        type: clientType,
      });
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button
          variant={clientType === "individual" ? "default" : "outline"}
          onClick={() => setClientType("individual")}
        >
          Individual Client
        </Button>
        <Button
          variant={clientType === "company" ? "default" : "outline"}
          onClick={() => setClientType("company")}
        >
          Company Client
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Common fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="client_code">{t("client_code")}</Label>
            <Input
              id="client_code"
              name="client_code"
              value={formData.client_code}
              onChange={handleChange}
            />
            {errors.client_code && (
              <p className="text-sm text-red-500">{errors.client_code}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number">{t("phone_number")}</Label>
            <Input
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
            />
            {errors.phone_number && (
              <p className="text-sm text-red-500">{errors.phone_number}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="wilaya">{t("wilaya")}</Label>
            <Input
              id="wilaya"
              name="wilaya"
              value={formData.wilaya}
              onChange={handleChange}
            />
            {errors.wilaya && (
              <p className="text-sm text-red-500">{errors.wilaya}</p>
            )}
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="address">{t("address")}</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address}</p>
            )}
          </div>
        </div>

        {/* Type-specific fields */}
        {clientType === "individual" ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("name")}</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="id_number">{t("id_number")}</Label>
              <Input
                id="id_number"
                name="id_number"
                value={formData.id_number}
                onChange={handleChange}
              />
              {errors.id_number && (
                <p className="text-sm text-red-500">{errors.id_number}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nin">{t("nin")}</Label>
              <Input
                id="nin"
                name="nin"
                value={formData.nin}
                onChange={handleChange}
              />
              {errors.nin && (
                <p className="text-sm text-red-500">{errors.nin}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationalite">{t("nationality")}</Label>
              <Input
                id="nationalite"
                name="nationalite"
                value={formData.nationalite}
                onChange={handleChange}
              />
              {errors.nationalite && (
                <p className="text-sm text-red-500">{errors.nationalite}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="raison_sociale">{t("company_name")}</Label>
              <Input
                id="raison_sociale"
                name="raison_sociale"
                value={formData.raison_sociale}
                onChange={handleChange}
              />
              {errors.raison_sociale && (
                <p className="text-sm text-red-500">{errors.raison_sociale}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nif">{t("nif")}</Label>
              <Input
                id="nif"
                name="nif"
                value={formData.nif}
                onChange={handleChange}
              />
              {errors.nif && (
                <p className="text-sm text-red-500">{errors.nif}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg_number">{t("reg_number")}</Label>
              <Input
                id="reg_number"
                name="reg_number"
                value={formData.reg_number}
                onChange={handleChange}
              />
              {errors.reg_number && (
                <p className="text-sm text-red-500">{errors.reg_number}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="legal_form">{t("legal_form")}</Label>
              <Input
                id="legal_form"
                name="legal_form"
                value={formData.legal_form}
                onChange={handleChange}
              />
              {errors.legal_form && (
                <p className="text-sm text-red-500">{errors.legal_form}</p>
              )}
            </div>
          </div>
        )}

        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
