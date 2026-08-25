import type { Metadata } from "next";
import { AppNavigationProvider } from "./navigation-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hotels in Tehran | Stayfinder",
  description: "Compare Tehran hotels, ratings, rooms, and nightly prices.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <AppNavigationProvider>{children}</AppNavigationProvider>
      </body>
    </html>
  );
}
