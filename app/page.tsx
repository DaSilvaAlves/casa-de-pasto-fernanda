"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Página raiz — redireciona para o locale por defeito (/pt).
 * Substitui o middleware.ts que não é suportado em static export.
 */
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/pt");
  }, [router]);

  return null;
}
