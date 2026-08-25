"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getStayDatesFromSearch, type StayDates } from "./date-utils";
import { fetchHotels, type HotelSearchResult } from "./hotel-api";
import { HotelList } from "./hotel-list";
import { useSharedSearch } from "./navigation";
import { SearchSummary } from "./search-summary";

export function HotelResultsLoading({ dates }: { dates: StayDates }) {
  return (
    <>
      <SearchSummary dates={dates} />
      <div aria-live="polite" className="grid gap-5 lg:grid-cols-2">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
            key={index}
          >
            <div className="aspect-[16/9] animate-pulse bg-slate-200" />
            <div className="space-y-3 p-5">
              <div className="h-6 w-2/3 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        ))}
        <span className="sr-only">Loading hotels for the selected dates</span>
      </div>
    </>
  );
}

export function DatedHotelResults({
  defaultDates,
  initialQueryDates,
  serverData,
}: {
  defaultDates: StayDates;
  initialQueryDates?: StayDates | null;
  serverData: HotelSearchResult | null;
}) {
  const [mounted, setMounted] = useState(false);
  const search = useSharedSearch();
  const dates =
    search === null
      ? initialQueryDates ?? defaultDates
      : getStayDatesFromSearch(search) ?? defaultDates;
  const serverDates = initialQueryDates ?? defaultDates;
  const initialDataMatchesDates =
    dates.startDate === serverDates.startDate &&
    dates.endDate === serverDates.endDate;

  useEffect(() => setMounted(true), []);

  const hotels = useQuery({
    queryKey: ["hotels", dates.startDate, dates.endDate],
    queryFn: ({ signal }) =>
      fetchHotels(dates, { signal, cache: "no-store" }),
    initialData: initialDataMatchesDates ? serverData ?? undefined : undefined,
    enabled: serverData !== null || mounted,
  });

  if (hotels.isPending) {
    return <HotelResultsLoading dates={dates} />;
  }

  if (hotels.isError) {
    return (
      <>
        <SearchSummary dates={dates} />
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-12 text-center">
          <p className="font-bold text-rose-900">We couldn’t load hotels for these dates.</p>
          <p className="mt-2 text-sm text-rose-700">{hotels.error.message}</p>
          <button
            className="mt-5 rounded-xl bg-rose-900 px-5 py-3 text-sm font-bold text-white"
            onClick={() => hotels.refetch()}
            type="button"
          >
            Try again
          </button>
        </div>
      </>
    );
  }

  const selectedDates =
    search === null
      ? initialQueryDates ?? undefined
      : getStayDatesFromSearch(search) ?? undefined;

  return (
    <>
      <SearchSummary dates={dates} total={hotels.data.total} />
      <HotelList dates={selectedDates} result={hotels.data} />
    </>
  );
}
