import type { StayDates } from "./date-utils";
import type { HotelSearchResult } from "./hotel-api";
import { DatedHotelResults } from "./dated-hotel-results";
import { SiteHeader } from "./site-header";

type HotelPlpProps = {
  defaultDates: StayDates;
  serverData: HotelSearchResult | null;
  queryDates?: StayDates | null;
  framework: "Next.js" | "React Router";
};

export function HotelPlp({
  defaultDates,
  serverData,
  queryDates,
  framework,
}: HotelPlpProps) {
  return (
    <main className="min-h-screen bg-[#f6f7f9] text-slate-950">
      <SiteHeader dates={defaultDates} framework={framework} />

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <DatedHotelResults
          defaultDates={defaultDates}
          initialQueryDates={queryDates}
          serverData={serverData}
        />
      </section>
    </main>
  );
}
