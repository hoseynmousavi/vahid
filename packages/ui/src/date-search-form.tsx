"use client";

import { useEffect, useState, type FormEvent } from "react";
import { addDays, getStayDatesFromSearch, type StayDates } from "./date-utils";
import {
  SharedLink,
  useSharedNavigate,
  useSharedSearch,
} from "./navigation";

export function DateSearchForm({
  action = "/",
  defaultDates,
}: {
  action?: string;
  defaultDates: StayDates;
}) {
  const [dates, setDates] = useState(defaultDates);
  const [hasDatedSearch, setHasDatedSearch] = useState(false);
  const navigate = useSharedNavigate();
  const search = useSharedSearch();

  useEffect(() => {
    if (search === null) return;

    const queryDates = getStayDatesFromSearch(search);
    setDates(queryDates ?? defaultDates);
    setHasDatedSearch(Boolean(queryDates));
  }, [defaultDates, search]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!navigate) return;

    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = new URLSearchParams({
      startDate: String(formData.get("startDate") || dates.startDate),
      endDate: String(formData.get("endDate") || dates.endDate),
    });
    setHasDatedSearch(true);
    navigate(`${action}?${query.toString()}`);
  }

  return (
    <form
      action={action}
      className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
      method="get"
      onSubmit={handleSubmit}
    >
      <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
        Check-in
        <input
          className="h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
          min={defaultDates.startDate}
          name="startDate"
          onChange={(event) => {
            const startDate = event.target.value;
            setDates((current) => ({
              startDate,
              endDate: current.endDate <= startDate ? addDays(startDate, 1) : current.endDate,
            }));
          }}
          required
          type="date"
          value={dates.startDate}
        />
      </label>

      <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
        Check-out
        <input
          className="h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
          min={addDays(dates.startDate, 1)}
          name="endDate"
          onChange={(event) => setDates((current) => ({ ...current, endDate: event.target.value }))}
          required
          type="date"
          value={dates.endDate}
        />
      </label>

      <div className="flex items-end gap-2">
        <button
          className="h-12 flex-1 rounded-xl bg-slate-950 px-6 text-sm font-bold text-white transition hover:bg-sky-600 sm:flex-none"
          type="submit"
        >
          Search hotels
        </button>
        {hasDatedSearch && (
          <SharedLink
            aria-label="Clear selected dates"
            className="grid h-12 w-12 place-items-center rounded-xl border border-slate-200 bg-white text-xl text-slate-500 transition hover:border-slate-400 hover:text-slate-950"
            href={action}
            title="Reset to today's search"
          >
            ×
          </SharedLink>
        )}
      </div>
    </form>
  );
}
