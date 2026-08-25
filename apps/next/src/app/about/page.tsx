import {
  ClientAboutPage,
  fetchAboutContent,
  fetchAboutSpotlight,
} from "@stack/ui";
import type { Metadata } from "next";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Our Story | Stayfinder",
  description:
    "Meet Stayfinder and discover how we make memorable stays easier to find.",
};

export const instant = false;

export default async function About() {
  await connection();
  const [content, spotlight] = await Promise.all([
    fetchAboutContent({ cache: "no-store" }),
    fetchAboutSpotlight({ cache: "no-store" }),
  ]);

  return (
    <ClientAboutPage
      initialContent={content}
      initialSpotlight={spotlight}
    />
  );
}
