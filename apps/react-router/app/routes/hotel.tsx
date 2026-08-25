import {
  fetchHotelDetails,
  getDefaultStayDates,
  getStayDatesFromSearch,
  hasStayDateParams,
  HotelPdp,
  normalizeHotelTitle,
} from "@stack/ui";
import type { Route } from "./+types/hotel";

export function meta({ loaderData }: Route.MetaArgs) {
  const hotel = loaderData?.serverData;

  return [
    { title: hotel?.seo_title || "Hotel in Tehran | Stayfinder" },
    {
      name: "description",
      content:
        hotel?.seo_meta_desc ||
        "View hotel photos, amenities, policies, and stay information in Tehran.",
    },
  ];
}

export async function loader({ params, request }: Route.LoaderArgs) {
  if (!params.hotelTitle) {
    throw new Response("Hotel not found", { status: 404 });
  }

  const defaultDates = getDefaultStayDates();
  const hotelTitle = normalizeHotelTitle(params.hotelTitle);
  const url = new URL(request.url);

  if (
    hasStayDateParams(
      url.searchParams.get("startDate"),
      url.searchParams.get("endDate"),
    )
  ) {
    return {
      defaultDates,
      hotelTitle,
      queryDates: getStayDatesFromSearch(url.search),
      serverData: null,
    };
  }

  const serverData = await fetchHotelDetails(hotelTitle);
  return { defaultDates, hotelTitle, queryDates: null, serverData };
}

export function clientLoader() {}

export default function HotelPage({ loaderData, params }: Route.ComponentProps) {
  const defaultDates = loaderData?.defaultDates ?? getDefaultStayDates();
  const hotelTitle =
    loaderData?.hotelTitle ?? normalizeHotelTitle(params.hotelTitle);

  return (
    <HotelPdp
      defaultDates={defaultDates}
      framework="React Router"
      hotelTitle={hotelTitle}
      queryDates={loaderData?.queryDates}
      serverData={loaderData?.serverData ?? null}
    />
  );
}
