import {
  fetchHotels,
  getDefaultStayDates,
  getStayDatesFromSearch,
  hasStayDateParams,
  HotelPlp,
} from "@stack/ui";

export const revalidate = 1;

type HomeProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: HomeProps) {
  const defaultDates = getDefaultStayDates();
  const params = await searchParams;
  const query = new URLSearchParams();
  if (typeof params.startDate === "string") query.set("startDate", params.startDate);
  if (typeof params.endDate === "string") query.set("endDate", params.endDate);
  const queryDates = getStayDatesFromSearch(query.toString());

  if (hasStayDateParams(params.startDate, params.endDate)) {
    return (
      <HotelPlp
        defaultDates={defaultDates}
        framework="Next.js"
        queryDates={queryDates}
        serverData={null}
      />
    );
  }

  const serverData = await fetchHotels(defaultDates, {
    next: {
      revalidate,
      tags: [`tehran-hotels-${defaultDates.startDate}-${defaultDates.endDate}`],
    },
  });

  return (
    <HotelPlp
      defaultDates={defaultDates}
      framework="Next.js"
      serverData={serverData}
    />
  );
}
