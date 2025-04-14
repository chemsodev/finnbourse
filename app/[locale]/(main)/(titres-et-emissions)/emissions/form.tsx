"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  createEmission,
  getEmission,
  updateEmission,
} from "@/app/actions/emissions-actions";
import type { Emission } from "@/lib/interfaces";

export default function EmissionForm() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const locale = params?.locale as string;
  const isEditMode = Boolean(id);
  const t = useTranslations("Emissions.form");

  const [formData, setFormData] = useState({
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

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);

  // Fetch emission data if in edit mode
  useEffect(() => {
    async function fetchEmission() {
      if (isEditMode) {
        try {
          const emission = await getEmission(id);
          if (emission) {
            setFormData({
              codeISIN: emission.codeISIN,
              issuer: emission.issuer,
              centralizingAgency: emission.centralizingAgency,
              viewAccountNumber: emission.viewAccountNumber,
              typeOfBroadcast: emission.typeOfBroadcast,
              issueAmount: emission.issueAmount,
              issueDate: emission.issueDate,
              dueDate: emission.dueDate,
              duration: emission.duration,
              cosobApproval: emission.cosobApproval,
              leader: emission.leader,
              coLead: emission.coLead,
              memberNo01: emission.memberNo01,
              memberNo02: emission.memberNo02,
              memberNo03: emission.memberNo03,
              memberNo04: emission.memberNo04,
            });
          }
        } catch (error) {
          console.error("Failed to fetch emission:", error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchEmission();
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value);
      });

      if (isEditMode) {
        await updateEmission(id, formDataObj);
      } else {
        await createEmission(formDataObj);
      }

      router.push(`/${locale}/emissions`);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="flex justify-center items-center h-52">
          <p>{t("loading")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-3xl font-bold text-secondary mb-4">
          {isEditMode ? t("editTitle") : t("newTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Row 1 */}
            <div className="space-y-2">
              <Label htmlFor="codeISIN" className="font-medium">
                {t("codeISIN")}:
              </Label>
              <Input
                id="codeISIN"
                name="codeISIN"
                value={formData.codeISIN}
                onChange={handleChange}
                className="bg-background"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issuer" className="font-medium">
                {t("issuer")}:
              </Label>
              <Input
                id="issuer"
                name="issuer"
                value={formData.issuer}
                onChange={handleChange}
                className="bg-background"
                required
              />
            </div>

            {/* Row 2 */}
            <div className="space-y-2">
              <Label htmlFor="centralizingAgency" className="font-medium">
                {t("centralizingAgency")}:
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
                {t("accountNumber")}:
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
                {t("broadcastType")}:
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
                {t("issueAmount")}:
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
                {t("issueDate")}:
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
                {t("dueDate")}:
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
                {t("duration")}:
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
                {t("cosobApproval")}:
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
                {t("leader")}:
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
                {t("coLead")}:
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
                {t("memberNo01")}:
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
                {t("memberNo02")}:
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
                {t("memberNo03")}:
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
                {t("memberNo04")}:
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

          <div className="mt-8 flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/${locale}/emissions`)}
              disabled={submitting}
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              className="bg-primary text-white hover:bg-primary/90"
              disabled={submitting}
            >
              {submitting
                ? t("processing")
                : isEditMode
                ? t("update")
                : t("submit")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
