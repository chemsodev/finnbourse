"use client";

import type React from "react";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EmissionForm() {
  const [formData, setFormData] = useState({
    search: "",
    codeISIN: "",
    issuer: "",
    centralizingAgency: "",
    viewAccountNumber: "",
    typeOfBroadcast: "",
    issueAmount: "",
    issueDate: "",
    dueDate: "",
    duration: "",
    cosobApproval: "",
    leader: "",
    coLead: "",
    memberNo01: "",
    memberNo02: "",
    memberNo03: "",
    memberNo04: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission logic here
  };

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-3xl font-bold text-secondary mb-4">
          Émission
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Row 1 */}
            <div className="space-y-2">
              <Label htmlFor="codeISIN" className="font-medium">
                Code ISIN:
              </Label>
              <Input
                id="codeISIN"
                name="codeISIN"
                value={formData.codeISIN}
                onChange={handleChange}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issuer" className="font-medium">
                Émetteur:
              </Label>
              <Input
                id="issuer"
                name="issuer"
                value={formData.issuer}
                onChange={handleChange}
                className="bg-background"
              />
            </div>

            {/* Row 2 */}
            <div className="space-y-2">
              <Label htmlFor="centralizingAgency" className="font-medium">
                Agence Centralisatrice:
              </Label>
              <Input
                id="centralizingAgency"
                name="centralizingAgency"
                value={formData.centralizingAgency}
                onChange={handleChange}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="viewAccountNumber" className="font-medium">
                Numéro de Compte:
              </Label>
              <Input
                id="viewAccountNumber"
                name="viewAccountNumber"
                value={formData.viewAccountNumber}
                onChange={handleChange}
                className="bg-background"
              />
            </div>

            {/* Row 3 */}
            <div className="space-y-2">
              <Label htmlFor="typeOfBroadcast" className="font-medium">
                Type de Diffusion:
              </Label>
              <Input
                id="typeOfBroadcast"
                name="typeOfBroadcast"
                value={formData.typeOfBroadcast}
                onChange={handleChange}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issueAmount" className="font-medium">
                Montant d'Émission:
              </Label>
              <Input
                id="issueAmount"
                name="issueAmount"
                value={formData.issueAmount}
                onChange={handleChange}
                className="bg-background"
              />
            </div>

            {/* Row 4 */}
            <div className="space-y-2">
              <Label htmlFor="issueDate" className="font-medium">
                Date d'Émission:
              </Label>
              <Input
                id="issueDate"
                name="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={handleChange}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="font-medium">
                Date d'Échéance:
              </Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                className="bg-background"
              />
            </div>

            {/* Row 5 */}
            <div className="space-y-2">
              <Label htmlFor="duration" className="font-medium">
                Durée:
              </Label>
              <Input
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cosobApproval" className="font-medium">
                Approbation COSOB:
              </Label>
              <Input
                id="cosobApproval"
                name="cosobApproval"
                value={formData.cosobApproval}
                onChange={handleChange}
                className="bg-background"
              />
            </div>

            {/* Row 6 */}
            <div className="space-y-2">
              <Label htmlFor="leader" className="font-medium">
                Chef de File:
              </Label>
              <Input
                id="leader"
                name="leader"
                value={formData.leader}
                onChange={handleChange}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coLead" className="font-medium">
                Co-Chef de File:
              </Label>
              <Input
                id="coLead"
                name="coLead"
                value={formData.coLead}
                onChange={handleChange}
                className="bg-background"
              />
            </div>

            {/* Row 7 */}
            <div className="space-y-2">
              <Label htmlFor="memberNo01" className="font-medium">
                Membre N°01:
              </Label>
              <Input
                id="memberNo01"
                name="memberNo01"
                value={formData.memberNo01}
                onChange={handleChange}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="memberNo02" className="font-medium">
                Membre N°02:
              </Label>
              <Input
                id="memberNo02"
                name="memberNo02"
                value={formData.memberNo02}
                onChange={handleChange}
                className="bg-background"
              />
            </div>

            {/* Row 8 */}
            <div className="space-y-2">
              <Label htmlFor="memberNo03" className="font-medium">
                Membre N°03:
              </Label>
              <Input
                id="memberNo03"
                name="memberNo03"
                value={formData.memberNo03}
                onChange={handleChange}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="memberNo04" className="font-medium">
                Membre N°04:
              </Label>
              <Input
                id="memberNo04"
                name="memberNo04"
                value={formData.memberNo04}
                onChange={handleChange}
                className="bg-background"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Soumettre
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
