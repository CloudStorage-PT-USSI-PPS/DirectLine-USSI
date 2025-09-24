
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import type { Chat } from "@/lib/types";

export default function AppRootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (user.role === 'client') {
          router.replace("/chat");
        } else if (user.role === 'cs') {
          router.replace("/dashboard");
        } else if (user.role === 'atasan') {
          router.replace('/performance-dashboard');
        }
      } else {
        router.replace("/login");
      }
    }
  }, [user, loading, router]);

  // Render a loading state or nothing while redirecting
  return null;
}
