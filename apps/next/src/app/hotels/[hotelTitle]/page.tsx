import {
  fetchHotelDetails,
  getDefaultStayDates,
  getStayDatesFromSearch,
  hasStayDateParams,
  HotelPdp,
  normalizeHotelTitle,
} from "@stack/ui";
import type { Metadata } from "next";

export const revalidate = 1;

type HotelPageProps = {
  params: Promise<{ hotelTitle: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: HotelPageProps): Promise<Metadata> {
  const { hotelTitle } = await params;
  const title = normalizeHotelTitle(hotelTitle)
    .replace(/^هتل-/, "")
    .replaceAll("-", " ");

  return {
    title: `Hotel ${title} in Tehran | Stayfinder`,
    description: `View photos, amenities, policies, and stay information for Hotel ${title} in Tehran.`,
  };
}

export default async function HotelPage({ params, searchParams }: HotelPageProps) {
  const [{ hotelTitle }, query] = await Promise.all([params, searchParams]);
  const normalizedHotelTitle = normalizeHotelTitle(hotelTitle);
  const defaultDates = getDefaultStayDates();
  const search = new URLSearchParams();
  if (typeof query.startDate === "string") search.set("startDate", query.startDate);
  if (typeof query.endDate === "string") search.set("endDate", query.endDate);
  const queryDates = getStayDatesFromSearch(search.toString());

  if (hasStayDateParams(query.startDate, query.endDate)) {
    return (
      <HotelPdp
        defaultDates={defaultDates}
        framework="Next.js"
        hotelTitle={normalizedHotelTitle}
        queryDates={queryDates}
        serverData={null}
      />
    );
  }

  const serverData = await fetchHotelDetails(normalizedHotelTitle, {
    next: {
      revalidate,
      tags: [`tehran-hotel-${normalizedHotelTitle}`],
    },
  });

  return (
    <HotelPdp
      defaultDates={defaultDates}
      framework="Next.js"
      hotelTitle={normalizedHotelTitle}
      serverData={serverData}
    />
  );
}
