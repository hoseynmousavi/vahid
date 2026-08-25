import {
  getDefaultStayDates,
  getStayDatesFromSearch,
  hasStayDateParams,
  HotelPlp,
} from "@stack/ui";
import { getCachedHotels } from "@/app/hotel-data";
import { cacheLife, cacheTag } from "next/cache";

export const instant = false;

type HomeProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  return getCachedHomePage(
    typeof params.startDate === "string" ? params.startDate : undefined,
    typeof params.endDate === "string" ? params.endDate : undefined,
  );
}

async function getCachedHomePage(startDate?: string, endDate?: string) {
  "use cache";

  cacheLife("seconds");

  const defaultDates = getDefaultStayDates();
  const query = new URLSearchParams();
  if (startDate) query.set("startDate", startDate);
  if (endDate) query.set("endDate", endDate);
  const queryDates = getStayDatesFromSearch(query.toString());

  if (hasStayDateParams(startDate, endDate)) {
    return (
      <HotelPlp
        defaultDates={defaultDates}
        framework="Next.js"
        queryDates={queryDates}
        serverData={null}
      />
    );
  }

  cacheTag(`tehran-hotels-${defaultDates.startDate}-${defaultDates.endDate}`);
  const serverData = await getCachedHotels(defaultDates);

  return (
    <HotelPlp
      defaultDates={defaultDates}
      framework="Next.js"
      serverData={serverData}
    />
  );
}
