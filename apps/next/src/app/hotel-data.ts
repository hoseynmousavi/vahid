import {
  fetchHotelDetails,
  fetchHotels,
  type StayDates,
} from "@stack/ui";
import { cacheLife, cacheTag } from "next/cache";

export async function getCachedHotels(dates: StayDates) {
  "use cache";

  cacheLife("seconds");
  cacheTag(`tehran-hotels-${dates.startDate}-${dates.endDate}`);

  return fetchHotels(dates);
}

export async function getCachedHotelDetails(hotelTitle: string) {
  "use cache";

  cacheLife("hours");
  cacheTag(`tehran-hotel-${hotelTitle}`);

  return fetchHotelDetails(hotelTitle);
}
