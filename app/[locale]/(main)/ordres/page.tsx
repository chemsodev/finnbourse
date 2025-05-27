"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OrdersRedirect() {
  const router = useRouter();

  useEffect(() => {
    // For now, always redirect to premiere-validation
    // Later you can implement role-based redirects when backend provides role data
    router.push("/ordres/premiere-validation");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div
          className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-primary rounded-full"
          role="status"
          aria-label="loading"
        >
          <span className="sr-only">Loading...</span>
        </div>
        <h2 className="text-xl font-semibold mt-4">
          Redirecting to Order Management...
        </h2>
      </div>
    </div>
  );
}
