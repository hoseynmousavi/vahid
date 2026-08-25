import type { StayDates } from "./date-utils";

export const HOTEL_API_URL = "https://hapi.snapptrip.com/hotel/api/v2/search-city";
export const HOTEL_MEDIA_URL = "https://store.snapptrip.com";
export const TEHRAN_CITY_ID = "6433";
export const TEHRAN_CITY_SLUG = "تهران";

export type Hotel = {
  id: number;
  title: string;
  fa_url: string;
  url: string;
  address: string;
  stars: number;
  price: number;
  price_off: number;
  discount_percent: number;
  is_available: boolean;
  instant_book: boolean;
  min_price_room_title: string;
  min_price_available_room_count: number;
  cover_media: { media: string; title: string } | null;
  reviews: { ptp_ratings: string; ptp_reviews: string } | null;
  badges: Array<{
    type: string;
    title: string;
    description: string;
    color: string;
  }>;
};

export type HotelSearchResult = {
  success: boolean;
  total: number;
  page: number;
  total_pages: number;
  data: Hotel[];
};

export type HotelDetails = {
  id: number;
  title: string;
  fa_url: string;
  status: boolean;
  accommodation_type: string;
  address: string;
  city_title: string;
  city_url: string;
  stars: number;
  description: string;
  snapp_description: string;
  seo_title: string;
  seo_meta_desc: string;
  check_in_time: string;
  check_out_time: string;
  cancellation_policy: string;
  privacy: string;
  instant_book: boolean;
  latlon: [number, number];
  cover_media: HotelMedia | null;
  gallery: HotelMedia[];
  facilities: Array<{ id: number; icon: string; title: string }>;
  reviews: { ptp_ratings: string; ptp_reviews: string } | null;
};

export type HotelMedia = {
  id: number;
  media: string;
  title: string;
};

type HotelRequestInit = RequestInit & {
  next?: { revalidate?: number; tags?: string[] };
};

export function createHotelSearchUrl({ startDate, endDate }: StayDates) {
  const params = new URLSearchParams({
    city_id: TEHRAN_CITY_ID,
    date_from: startDate,
    date_to: endDate,
    page: "1",
    order_by: "selling",
    token: "Jek",
    no_rooms: "1",
  });

  return `${HOTEL_API_URL}?${params.toString()}`;
}

export function createHotelDetailsUrl(hotelTitle: string) {
  return `${HOTEL_API_URL.replace("/search-city", "")}/hotels/slug/${encodeURIComponent(
    TEHRAN_CITY_SLUG,
  )}/${encodeURIComponent(normalizeHotelTitle(hotelTitle))}`;
}

export function normalizeHotelTitle(hotelTitle: string) {
  try {
    return decodeURIComponent(hotelTitle);
  } catch {
    return hotelTitle;
  }
}

export async function fetchHotels(
  dates: StayDates,
  init?: HotelRequestInit,
): Promise<HotelSearchResult> {
  const response = await fetch(createHotelSearchUrl(dates), init);

  if (!response.ok) {
    throw new Error(`Hotel search failed with status ${response.status}`);
  }

  const result = (await response.json()) as HotelSearchResult;

  if (!result.success || !Array.isArray(result.data)) {
    throw new Error("The hotel API returned an invalid response");
  }

  return result;
}

export async function fetchHotelDetails(
  hotelTitle: string,
  init?: HotelRequestInit,
): Promise<HotelDetails> {
  const response = await fetch(createHotelDetailsUrl(hotelTitle), init);

  if (!response.ok) {
    throw new Error(`Hotel details failed with status ${response.status}`);
  }

  const result = (await response.json()) as HotelDetails & {
    success?: boolean;
    message?: string;
  };

  if (result.success === false || !result.id || !result.title) {
    throw new Error(result.message || "The hotel detail API returned an invalid response");
  }

  return result;
}

export function getHotelImageUrl(path?: string) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${HOTEL_MEDIA_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
