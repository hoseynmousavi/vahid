import type { StayDates } from "./date-utils";
import { getHotelImageUrl, type HotelSearchResult } from "./hotel-api";
import { SharedLink } from "./navigation";

type HotelListProps = { result: HotelSearchResult; dates?: StayDates };
const priceFormatter = new Intl.NumberFormat("fa-IR");

function StarRating({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${count} stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span
          aria-hidden="true"
          className={index < count ? "text-amber-400" : "text-slate-200"}
          key={index}
        >
          ★
        </span>
      ))}
    </span>
  );
}

export function HotelList({ dates, result }: HotelListProps) {
  if (result.data.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <p className="text-lg font-semibold text-slate-900">No hotels found</p>
        <p className="mt-2 text-sm text-slate-500">Try another pair of dates.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {result.data.map((hotel, index) => {
        const imageUrl = getHotelImageUrl(hotel.cover_media?.media);
        const displayPrice = hotel.price_off || hotel.price;
        const query = dates
          ? `?${new URLSearchParams(dates).toString()}`
          : "";
        const detailsUrl = `/hotels/${encodeURIComponent(hotel.fa_url || hotel.url)}${query}`;

        return (
          <article
            className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            key={hotel.id}
          >
            <SharedLink
              className="relative block aspect-[16/9] overflow-hidden bg-slate-100"
              href={detailsUrl}
            >
              {imageUrl ? (
                <img
                  alt={hotel.cover_media?.title || hotel.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  decoding="async"
                  fetchPriority={index < 2 ? "high" : "auto"}
                  loading={index < 2 ? "eager" : "lazy"}
                  src={imageUrl}
                />
              ) : (
                <div className="grid h-full place-items-center text-sm text-slate-400">
                  Hotel photo unavailable
                </div>
              )}

              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                {hotel.discount_percent > 0 && (
                  <span className="rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                    {priceFormatter.format(hotel.discount_percent)}% off
                  </span>
                )}
                {hotel.instant_book && (
                  <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-emerald-700 shadow-sm">
                    Instant booking
                  </span>
                )}
              </div>
            </SharedLink>

            <div className="p-5" dir="rtl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-950">
                    <SharedLink className="hover:text-sky-600" href={detailsUrl}>
                      هتل {hotel.title}
                    </SharedLink>
                  </h2>
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <StarRating count={hotel.stars} />
                    {hotel.reviews && Number(hotel.reviews.ptp_ratings) > 0 && (
                      <span className="text-slate-500">
                        {priceFormatter.format(Number(hotel.reviews.ptp_ratings))} از ۵
                      </span>
                    )}
                  </div>
                </div>
                {hotel.min_price_available_room_count > 0 &&
                  hotel.min_price_available_room_count <= 3 && (
                    <span className="shrink-0 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-700">
                      {priceFormatter.format(hotel.min_price_available_room_count)} اتاق مانده
                    </span>
                  )}
              </div>

              <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-6 text-slate-500">
                {hotel.address}
              </p>

              <div className="mt-5 flex items-end justify-between gap-4 border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-500">{hotel.min_price_room_title}</p>
                <div className="text-left">
                  {hotel.price > displayPrice && (
                    <p className="text-xs text-slate-400 line-through">
                      {priceFormatter.format(hotel.price)}
                    </p>
                  )}
                  <p className="whitespace-nowrap text-lg font-black text-slate-950">
                    {priceFormatter.format(displayPrice)}
                    <span className="mr-1 text-xs font-medium text-slate-500">تومان</span>
                  </p>
                  <p className="text-[11px] text-slate-400">برای هر شب</p>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
