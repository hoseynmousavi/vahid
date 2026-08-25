import {
  getDefaultStayDates,
  getStayDatesFromSearch,
  hasStayDateParams,
  HotelPdp,
  normalizeHotelTitle,
} from "@stack/ui";
import { getCachedHotelDetails } from "@/app/hotel-data";
import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";

export const instant = false;

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

  return getCachedHotelPage(
    normalizedHotelTitle,
    typeof query.startDate === "string" ? query.startDate : undefined,
    typeof query.endDate === "string" ? query.endDate : undefined,
  );
}

async function getCachedHotelPage(
  hotelTitle: string,
  startDate?: string,
  endDate?: string,
) {
  "use cache";

  cacheLife("hours");
  cacheTag(`tehran-hotel-${hotelTitle}`);

  const defaultDates = getDefaultStayDates();
  const search = new URLSearchParams();
  if (startDate) search.set("startDate", startDate);
  if (endDate) search.set("endDate", endDate);
  const queryDates = getStayDatesFromSearch(search.toString());

  if (hasStayDateParams(startDate, endDate)) {
    return (
      <HotelPdp
        defaultDates={defaultDates}
        framework="Next.js"
        hotelTitle={hotelTitle}
        queryDates={queryDates}
        serverData={null}
      />
    );
  }

  const serverData = await getCachedHotelDetails(hotelTitle);

  return (
    <HotelPdp
      defaultDates={defaultDates}
      framework="Next.js"
      hotelTitle={hotelTitle}
      serverData={serverData}
    />
  );
}
