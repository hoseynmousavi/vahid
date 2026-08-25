import {
  fetchHotels,
  getDefaultStayDates,
  getStayDatesFromSearch,
  hasStayDateParams,
  HotelPlp,
} from "@stack/ui";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hotels in Tehran | Stayfinder" },
    {
      name: "description",
      content: "Compare Tehran hotels, ratings, rooms, and nightly prices.",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const defaultDates = getDefaultStayDates();
  const url = new URL(request.url);

  if (
    hasStayDateParams(
      url.searchParams.get("startDate"),
      url.searchParams.get("endDate"),
    )
  ) {
    return {
      defaultDates,
      queryDates: getStayDatesFromSearch(url.search),
      serverData: null,
    };
  }

  const serverData = await fetchHotels(defaultDates);

  return {
    defaultDates,
    queryDates: null,
    serverData,
  };
}

export function clientLoader() {}

export default function Home({ loaderData }: Route.ComponentProps) {
  const defaultDates = loaderData?.defaultDates ?? getDefaultStayDates();

  return (
    <HotelPlp
      defaultDates={defaultDates}
      framework="React Router"
      queryDates={loaderData?.queryDates}
      serverData={loaderData?.serverData ?? null}
    />
  );
}
