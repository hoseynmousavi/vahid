"use client";

import { NavigationProvider } from "@stack/ui";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export function AppNavigationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <NavigationProvider navigate={(href) => router.push(href)}>
      {children}
    </NavigationProvider>
  );
}
