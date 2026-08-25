import {
  fetchHotelDetails,
  getStayDatesFromSearch,
  HotelDetailsLoading,
  HotelPdpDetails,
  HotelPdpShell,
  normalizeHotelTitle,
  type StayDates,
} from "@stack/ui";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getCachedDefaultStayDates } from "../../default-stay-dates";

const REVALIDATE_SECONDS = 3600;

type HotelPageProps = {
  params: Promise<{ hotelTitle: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
}: HotelPageProps): Promise<Metadata> {
  const { hotelTitle } = await params;
  const title = normalizeHotelTitle(hotelTitle)
    .replace(/^هتل-/, "")
    .replaceAll("-", " ");

  return {
    title: `Hotel ${title} in Tehran | Stayfinder`,
    description: `View photos, amenities, policies, and stay information for Hotel ${title} in Tehran.`,
  };
}

async function HotelDetails({
  defaultDates,
  params,
  searchParams,
}: HotelPageProps & { defaultDates: StayDates }) {
  const [{ hotelTitle }, query] = await Promise.all([params, searchParams]);
  const normalizedHotelTitle = normalizeHotelTitle(hotelTitle);
  const search = new URLSearchParams();

  if (typeof query.startDate === "string") {
    search.set("startDate", query.startDate);
  }
  if (typeof query.endDate === "string") {
    search.set("endDate", query.endDate);
  }

  const queryDates = getStayDatesFromSearch(search.toString());
  const serverData = await fetchHotelDetails(normalizedHotelTitle, {
    next: {
      revalidate: REVALIDATE_SECONDS,
      tags: [`tehran-hotel-${normalizedHotelTitle}`],
    },
  });

  return (
    <HotelPdpDetails
      defaultDates={defaultDates}
      hotelTitle={normalizedHotelTitle}
      queryDates={queryDates}
      serverData={serverData}
    />
  );
}

export default async function HotelPage(props: HotelPageProps) {
  const defaultDates = await getCachedDefaultStayDates();

  return (
    <Suspense
      fallback={
        <HotelPdpShell
          defaultDates={defaultDates}
          framework="Next.js"
          hotelTitle=""
        >
          <HotelDetailsLoading />
        </HotelPdpShell>
      }
    >
      <HotelPageContent defaultDates={defaultDates} {...props} />
    </Suspense>
  );
}

async function HotelPageContent({
  defaultDates,
  params,
  searchParams,
}: HotelPageProps & { defaultDates: StayDates }) {
  const { hotelTitle } = await params;
  const normalizedHotelTitle = normalizeHotelTitle(hotelTitle);

  return (
    <HotelPdpShell
      defaultDates={defaultDates}
      framework="Next.js"
      hotelTitle={normalizedHotelTitle}
    >
      <Suspense fallback={<HotelDetailsLoading />}>
        <HotelDetails
          defaultDates={defaultDates}
          params={params}
          searchParams={searchParams}
        />
      </Suspense>
    </HotelPdpShell>
  );
}
