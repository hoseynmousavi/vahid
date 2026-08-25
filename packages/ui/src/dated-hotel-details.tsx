"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getStayDatesFromSearch, type StayDates } from "./date-utils";
import { fetchHotelDetails, type HotelDetails } from "./hotel-api";
import { HotelDetailsView } from "./hotel-details-view";
import { useSharedSearch } from "./navigation";

export function DatedHotelDetails({
  defaultDates,
  hotelTitle,
  initialQueryDates,
  serverData,
}: {
  defaultDates: StayDates;
  hotelTitle: string;
  initialQueryDates?: StayDates | null;
  serverData: HotelDetails | null;
}) {
  const [mounted, setMounted] = useState(false);
  const search = useSharedSearch();
  const dates =
    search === null
      ? initialQueryDates ?? defaultDates
      : getStayDatesFromSearch(search) ?? defaultDates;

  useEffect(() => setMounted(true), []);

  const hotel = useQuery({
    queryKey: ["hotel", hotelTitle],
    queryFn: ({ signal }) =>
      fetchHotelDetails(hotelTitle, { cache: "no-store", signal }),
    initialData: serverData ?? undefined,
    enabled: serverData !== null || mounted,
  });

  if (hotel.isPending) {
    return (
      <div aria-live="polite">
        <div className="aspect-[16/7] animate-pulse rounded-3xl bg-slate-200" />
        <div className="mt-8 grid gap-4">
          <div className="h-10 w-2/3 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-5 w-full animate-pulse rounded bg-slate-100" />
          <div className="h-5 w-4/5 animate-pulse rounded bg-slate-100" />
        </div>
        <span className="sr-only">Loading hotel details</span>
      </div>
    );
  }

  if (hotel.isError) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-16 text-center">
        <h1 className="text-xl font-black text-rose-900">We couldn’t load this hotel.</h1>
        <p className="mt-2 text-sm text-rose-700">{hotel.error.message}</p>
        <button
          className="mt-5 rounded-xl bg-rose-900 px-5 py-3 text-sm font-bold text-white"
          onClick={() => hotel.refetch()}
          type="button"
        >
          Try again
        </button>
      </div>
    );
  }

  return <HotelDetailsView dates={dates} hotel={hotel.data} />;
}
