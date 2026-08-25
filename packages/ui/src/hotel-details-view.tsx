import type { StayDates } from "./date-utils";
import { getHotelImageUrl, type HotelDetails } from "./hotel-api";
import { SharedLink } from "./navigation";

function detailsQuery(dates?: StayDates) {
  return dates ? `?${new URLSearchParams(dates).toString()}` : "";
}

function StarRating({ count }: { count: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${count} stars`}>
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

function HotelGallery({ hotel }: { hotel: HotelDetails }) {
  const media = hotel.gallery?.length
    ? hotel.gallery.slice(0, 5)
    : hotel.cover_media
      ? [hotel.cover_media]
      : [];

  if (media.length === 0) {
    return (
      <div className="grid aspect-[16/7] place-items-center rounded-3xl bg-slate-200 text-slate-500">
        Hotel photos unavailable
      </div>
    );
  }

  return (
    <div className="grid overflow-hidden rounded-3xl bg-slate-200 sm:h-[430px] sm:grid-cols-4 sm:grid-rows-2 sm:gap-1">
      {media.map((item, index) => (
        <div
          className={
            index === 0
              ? "aspect-[16/10] sm:col-span-2 sm:row-span-2 sm:aspect-auto"
              : "hidden sm:block"
          }
          key={item.id}
        >
          <img
            alt={item.title || hotel.title}
            className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]"
            fetchPriority={index === 0 ? "high" : "auto"}
            loading={index === 0 ? "eager" : "lazy"}
            src={getHotelImageUrl(item.media) ?? undefined}
          />
        </div>
      ))}
    </div>
  );
}

export function HotelDetailsView({
  dates,
  hotel,
}: {
  dates?: StayDates;
  hotel: HotelDetails;
}) {
  const query = detailsQuery(dates);
  const description = hotel.snapp_description || hotel.description.replace(/<[^>]+>/g, " ");

  return (
    <div>
      <SharedLink
        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-sky-600"
        href={`/${query}`}
      >
        <span aria-hidden="true">←</span> Back to Tehran hotels
      </SharedLink>

      <HotelGallery hotel={hotel} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0" dir="rtl">
          <div className="border-b border-slate-200 pb-7">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
                {hotel.accommodation_type}
              </span>
              {hotel.instant_book && (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  رزرو آنی
                </span>
              )}
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              هتل {hotel.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <StarRating count={hotel.stars} />
              <span>{hotel.address}</span>
            </div>
          </div>

          <section className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-black text-slate-950">درباره هتل</h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-8 text-slate-600">
              {description}
            </p>
          </section>

          {hotel.facilities?.length > 0 && (
            <section className="border-b border-slate-200 py-8">
              <h2 className="text-2xl font-black text-slate-950">امکانات هتل</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {hotel.facilities.slice(0, 15).map((facility) => (
                  <div
                    className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm font-semibold text-slate-700 ring-1 ring-slate-200"
                    key={facility.id}
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                      ✓
                    </span>
                    {facility.title}
                  </div>
                ))}
              </div>
            </section>
          )}

          {hotel.cancellation_policy && (
            <section className="py-8">
              <h2 className="text-2xl font-black text-slate-950">قوانین کنسلی</h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-8 text-slate-600">
                {hotel.cancellation_policy}
              </p>
            </section>
          )}
        </div>

        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-sky-600">
            Your stay
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Check-in</p>
              <p className="mt-1 font-black text-slate-950">{hotel.check_in_time || "14:00"}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Check-out</p>
              <p className="mt-1 font-black text-slate-950">{hotel.check_out_time || "12:00"}</p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-500">
            Choose your dates above to check availability for this hotel.
          </p>
          <a
            className="mt-5 block rounded-xl bg-slate-950 px-5 py-3.5 text-center text-sm font-bold text-white transition hover:bg-sky-600"
            href="#top"
          >
            Change dates
          </a>
        </aside>
      </div>
    </div>
  );
}
