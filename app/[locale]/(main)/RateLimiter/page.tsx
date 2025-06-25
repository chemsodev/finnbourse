"use client";

import { redirect, useRouter } from "@/i18n/routing";
import { Gauge } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = () => {
  const t = useTranslations("rateLimitReached");
  const router = useRouter();

  // Automatically redirect to login after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <div className="text-primary mb-4">
          <Gauge className="w-16 h-16 mx-auto" />
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Please Wait
        </h1>

        <p className="text-gray-600 mb-6">
          We're processing your request. You'll be redirected to login shortly.
        </p>

        <div className="flex gap-3 justify-center">
          <Link href="/login">
            <Button className="px-6">Continue to Login</Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="px-6"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default page;
