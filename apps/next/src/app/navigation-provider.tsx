"use client";

import {
  AboutNavigationPreview,
  NavigationProvider,
  useSharedPendingNavigation,
} from "@stack/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, ReactNode } from "react";

function PrefetchLink(props: ComponentProps<typeof Link>) {
  return <Link prefetch {...props} />;
}

function NavigationViewport({ children }: { children: ReactNode }) {
  const { pendingHref } = useSharedPendingNavigation();

  const pendingPathname = pendingHref
    ? new URL(pendingHref, "http://internal").pathname
    : null;
  const isAboutPending = pendingPathname === "/about";

  return (
    <>
      <div hidden={isAboutPending}>{children}</div>
      {isAboutPending && <AboutNavigationPreview />}
    </>
  );
}

export function AppNavigationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <NavigationProvider
      linkComponent={PrefetchLink}
      navigate={(href) => router.push(href)}
    >
      <NavigationViewport>{children}</NavigationViewport>
    </NavigationProvider>
  );
}
