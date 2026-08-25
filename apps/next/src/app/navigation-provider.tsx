"use client";

import { NavigationProvider } from "@stack/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, ReactNode } from "react";

function PrefetchLink(props: ComponentProps<typeof Link>) {
  return <Link prefetch {...props} />;
}

export function AppNavigationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <NavigationProvider
      linkComponent={PrefetchLink}
      navigate={(href) => router.push(href)}
    >
      {children}
    </NavigationProvider>
  );
}
