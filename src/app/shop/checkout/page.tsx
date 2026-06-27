"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function RedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const productId = searchParams.get("productId") || searchParams.get("product");
    const quantity = searchParams.get("quantity") || "1";
    const params = new URLSearchParams();
    if (productId) params.set("product", productId);
    params.set("quantity", quantity);
    router.replace(`/checkout?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-wine border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function ShopCheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-wine border-t-transparent rounded-full animate-spin" /></div>}>
      <RedirectContent />
    </Suspense>
  );
}
