"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import {
  fetchAboutContent,
  fetchAboutSpotlight,
  type AboutSpotlightContent,
} from "./about-api";
import { AboutPage, type AboutContent } from "./about-page";
import {
  AboutSpotlight,
  AboutSpotlightLoading,
} from "./about-spotlight";
import {
  SharedLink,
  useSharedPendingNavigation,
} from "./navigation";

export function AboutPageLoading({ children }: { children?: ReactNode } = {}) {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="min-h-screen bg-[#fffaf1] text-[#17352b]"
    >
      <header className="border-b border-[#17352b]/10">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <SharedLink className="flex items-center gap-3" href="/">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#17352b] text-sm font-black text-[#f6c453]">
              S
            </span>
            <span className="text-lg font-black tracking-[-0.04em]">
              stayfinder
            </span>
          </SharedLink>
          <SharedLink
            className="rounded-full bg-[#17352b] px-5 py-3 text-sm font-bold text-white"
            href="/"
          >
            Explore stays
          </SharedLink>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-2">
        <div className="space-y-6 pt-16">
          <div className="h-9 w-32 animate-pulse rounded-full bg-[#17352b]/10" />
          <div className="h-20 w-full max-w-lg animate-pulse rounded-3xl bg-[#17352b]/10" />
          <div className="h-20 w-4/5 max-w-md animate-pulse rounded-3xl bg-[#df765c]/15" />
          <div className="h-6 w-full max-w-xl animate-pulse rounded bg-[#17352b]/10" />
          <div className="h-6 w-3/4 max-w-lg animate-pulse rounded bg-[#17352b]/10" />
        </div>
        <div className="aspect-[4/5] w-full max-w-[570px] animate-pulse rounded-[2.5rem] bg-[#d9e6de]" />
      </section>
      {children}
      <span className="sr-only">Loading the About page</span>
    </main>
  );
}

function useAboutSpotlight(
  initialData?: AboutSpotlightContent,
  enabled = true,
) {
  return useQuery({
    queryKey: ["about-spotlight"],
    queryFn: ({ signal }) =>
      fetchAboutSpotlight({ cache: "no-store", signal }),
    initialData,
    enabled,
  });
}

function SpotlightResult({
  spotlight,
}: {
  spotlight: ReturnType<typeof useAboutSpotlight>;
}) {
  if (spotlight.isPending) {
    return <AboutSpotlightLoading />;
  }

  if (spotlight.isError) {
    return (
      <section className="bg-rose-950 px-5 py-16 text-center text-white">
        <p className="font-bold">We couldn’t load the network spotlight.</p>
        <p className="mt-2 text-sm text-rose-200">
          {spotlight.error.message}
        </p>
        <button
          className="mt-5 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-rose-950"
          onClick={() => spotlight.refetch()}
          type="button"
        >
          Try again
        </button>
      </section>
    );
  }

  return <AboutSpotlight content={spotlight.data} />;
}

function AboutError({
  error,
  retry,
}: {
  error: Error;
  retry: () => void;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#fffaf1] px-5 text-center text-[#17352b]">
      <div className="max-w-md rounded-[2rem] border border-[#df765c]/30 bg-white/60 p-8">
        <h1 className="text-2xl font-black">We couldn’t load our story.</h1>
        <p className="mt-3 text-[#60736c]">{error.message}</p>
        <button
          className="mt-6 rounded-full bg-[#17352b] px-6 py-3 text-sm font-bold text-white"
          onClick={retry}
          type="button"
        >
          Try again
        </button>
      </div>
    </main>
  );
}

export function AboutNavigationPreview() {
  const about = useQuery({
    queryKey: ["about-navigation-preview"],
    queryFn: ({ signal }) =>
      fetchAboutContent({ cache: "no-store", signal }),
    gcTime: 0,
    staleTime: 0,
  });
  const spotlight = useQuery({
    queryKey: ["about-spotlight-navigation-preview"],
    queryFn: ({ signal }) =>
      fetchAboutSpotlight({ cache: "no-store", signal }),
    gcTime: 0,
    staleTime: 0,
  });
  const spotlightSection = <SpotlightResult spotlight={spotlight} />;

  if (about.isPending) {
    return <AboutPageLoading>{spotlightSection}</AboutPageLoading>;
  }

  if (about.isError) {
    return <AboutError error={about.error} retry={() => about.refetch()} />;
  }

  return <AboutPage content={about.data} supplemental={spotlightSection} />;
}

export function ClientAboutPage({
  initialContent,
  initialSpotlight,
}: {
  initialContent?: AboutContent;
  initialSpotlight?: AboutSpotlightContent;
}) {
  const [mounted, setMounted] = useState(false);
  const { completeNavigation } = useSharedPendingNavigation();

  useEffect(() => {
    setMounted(true);
    completeNavigation?.();
  }, [completeNavigation]);

  const about = useQuery({
    queryKey: ["about"],
    queryFn: ({ signal }) =>
      fetchAboutContent({ cache: "no-store", signal }),
    initialData: initialContent,
    enabled: initialContent !== undefined || mounted,
  });
  const spotlight = useAboutSpotlight(
    initialSpotlight,
    initialSpotlight !== undefined || mounted,
  );
  const spotlightSection = <SpotlightResult spotlight={spotlight} />;

  if (about.isPending) {
    return <AboutPageLoading>{spotlightSection}</AboutPageLoading>;
  }

  if (about.isError) {
    return <AboutError error={about.error} retry={() => about.refetch()} />;
  }

  return <AboutPage content={about.data} supplemental={spotlightSection} />;
}
