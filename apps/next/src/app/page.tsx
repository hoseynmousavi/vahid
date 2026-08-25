import {
  fetchHotels,
  getStayDatesFromSearch,
  HotelPlpResults,
  HotelPlpShell,
  HotelResultsLoading,
  type StayDates,
} from "@stack/ui";
import { Suspense } from "react";
import { getCachedDefaultStayDates } from "./default-stay-dates";

const REVALIDATE_SECONDS = 3600;

type HomeProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

async function HotelResults({
  defaultDates,
  searchParams,
}: HomeProps & { defaultDates: StayDates }) {
  const params = await searchParams;
  const query = new URLSearchParams();

  if (typeof params.startDate === "string") {
    query.set("startDate", params.startDate);
  }
  if (typeof params.endDate === "string") {
    query.set("endDate", params.endDate);
  }

  const queryDates = getStayDatesFromSearch(query.toString());
  const dates = queryDates ?? defaultDates;
  const serverData = await fetchHotels(dates, {
    next: {
      revalidate: REVALIDATE_SECONDS,
      tags: [`tehran-hotels-${dates.startDate}-${dates.endDate}`],
    },
  });

  return (
    <HotelPlpResults
      defaultDates={defaultDates}
      queryDates={queryDates}
      serverData={serverData}
    />
  );
}

export default async function Home({ searchParams }: HomeProps) {
  const defaultDates = await getCachedDefaultStayDates();

  return (
    <HotelPlpShell defaultDates={defaultDates} framework="Next.js">
      <Suspense fallback={<HotelResultsLoading dates={defaultDates} />}>
        <HotelResults
          defaultDates={defaultDates}
          searchParams={searchParams}
        />
      </Suspense>
    </HotelPlpShell>
  );
}
