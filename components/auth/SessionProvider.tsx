"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { enablePush } from "@/lib/notifications/enablePush";

function PushInitializer() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      enablePush();
    }
  }, [session]);

  return null;
}

export default function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <PushInitializer />
      {children}
    </SessionProvider>
  );
}