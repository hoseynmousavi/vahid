import type { StayDates } from "./date-utils";
import { DatedHotelDetails } from "./dated-hotel-details";
import type { HotelDetails } from "./hotel-api";
import { SiteHeader } from "./site-header";
import type { ReactNode } from "react";

export function HotelPdp({
  defaultDates,
  framework,
  hotelTitle,
  queryDates,
  serverData,
}: {
  defaultDates: StayDates;
  framework: "Next.js" | "React Router";
  hotelTitle: string;
  queryDates?: StayDates | null;
  serverData: HotelDetails | null;
}) {
  return (
    <HotelPdpShell
      defaultDates={defaultDates}
      framework={framework}
      hotelTitle={hotelTitle}
    >
      <HotelPdpDetails
        defaultDates={defaultDates}
        hotelTitle={hotelTitle}
        queryDates={queryDates}
        serverData={serverData}
      />
    </HotelPdpShell>
  );
}

export function HotelPdpShell({
  children,
  defaultDates,
  framework,
  hotelTitle,
}: {
  children: ReactNode;
  defaultDates: StayDates;
  framework: "Next.js" | "React Router";
  hotelTitle: string;
}) {
  const formAction = hotelTitle
    ? `/hotels/${encodeURIComponent(hotelTitle)}`
    : "/";

  return (
    <main className="min-h-screen bg-[#f6f7f9] text-slate-950" id="top">
      <SiteHeader dates={defaultDates} formAction={formAction} framework={framework} />
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        {children}
      </section>
    </main>
  );
}

export function HotelPdpDetails({
  defaultDates,
  hotelTitle,
  queryDates,
  serverData,
}: Omit<Parameters<typeof HotelPdp>[0], "framework">) {
  return (
    <DatedHotelDetails
      defaultDates={defaultDates}
      hotelTitle={hotelTitle}
      initialQueryDates={queryDates}
      serverData={serverData}
    />
  );
}
