

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/layout/logo";

export default function Gate() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Redirect based on role
        if (user.role === 'client') {
          router.push("/chat");
        } else {
          router.push("/dashboard");
        }
      } else {
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <Logo />
        <div className="space-y-2 text-center">
            <p className="text-sm text-muted-foreground">Memuat sesi Anda...</p>
        </div>
      </div>
    </div>
  );
}

