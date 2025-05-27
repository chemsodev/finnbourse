"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Wallet,
  CheckCircle,
  Clock,
  Users,
  Building,
  Briefcase,
} from "lucide-react";

export default function OrderManagementAdmin() {
  const t = useTranslations("orderManagement");

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-primary mb-8">
        Order Management Navigation
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Agency Section */}
        <Card className="border-primary/20">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Agency
            </CardTitle>
            <CardDescription>Agency order management pages</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <Link href="/ordres/premiere-validation" className="w-full">
              <Button variant="outline" className="w-full flex justify-between">
                <span>First Validation</span>
                <Clock className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/ordres/validation-finale" className="w-full">
              <Button variant="outline" className="w-full flex justify-between">
                <span>Final Validation</span>
                <CheckCircle className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* TCC Section */}
        <Card className="border-secondary/20">
          <CardHeader className="bg-secondary/5">
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              TCC
            </CardTitle>
            <CardDescription>TCC order management pages</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <Link href="/ordres/validation-tcc-premiere" className="w-full">
              <Button variant="outline" className="w-full flex justify-between">
                <span>TCC First Validation</span>
                <Clock className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/ordres/validation-tcc-finale" className="w-full">
              <Button variant="outline" className="w-full flex justify-between">
                <span>TCC Final Validation</span>
                <CheckCircle className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* IOB Section */}
        <Card className="border-blue-500/20">
          <CardHeader className="bg-blue-500/5">
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              IOB
            </CardTitle>
            <CardDescription>IOB order management pages</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <Link href="/ordres/execution" className="w-full">
              <Button variant="outline" className="w-full flex justify-between">
                <span>Order Execution</span>
                <Wallet className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/ordres/resultats" className="w-full">
              <Button variant="outline" className="w-full flex justify-between">
                <span>Submit Results</span>
                <CheckCircle className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Link href="/ordres">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    </div>
  );
}
