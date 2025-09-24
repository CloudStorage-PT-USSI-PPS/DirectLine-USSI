
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
          try {
            // Check for active sessions that have been picked up by a CS
            const allConsultations: Chat[] = JSON.parse(sessionStorage.getItem('new-consultations') || '[]');
            const activeCsSessionIds: string[] = JSON.parse(sessionStorage.getItem('active-cs-sessions') || '[]');
            
            const clientActiveSession = allConsultations.find(chat => 
              chat.client.id === user.id && activeCsSessionIds.includes(chat.id)
            );

            if (clientActiveSession) {
              // If there's an active session handled by CS, go directly to the chat room.
              // The chat page will be responsible for loading this session.
              router.replace("/chat");
            } else {
              // Otherwise, show the start consultation flow.
              router.replace("/chat");
            }
          } catch (e) {
            console.error("Failed to check active sessions, redirecting to default chat.", e);
            router.replace("/chat");
          }
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
