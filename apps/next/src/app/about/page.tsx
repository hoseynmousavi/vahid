import {
  AboutPageLoading,
  ClientAboutPage,
  fetchAboutContent,
} from "@stack/ui";
import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Our Story | Stayfinder",
  description:
    "Meet Stayfinder and discover how we make memorable stays easier to find.",
};

async function AboutContent() {
  await connection();
  const content = await fetchAboutContent({ cache: "no-store" });

  return <ClientAboutPage initialContent={content} />;
}

export default function About() {
  return (
    <Suspense fallback={<AboutPageLoading />}>
      <AboutContent />
    </Suspense>
  );
}
