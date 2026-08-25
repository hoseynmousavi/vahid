import type { StayDates } from "./date-utils";

function prettyDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}

export function SearchSummary({
  dates,
  total,
}: {
  dates: StayDates;
  total?: number;
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">Tehran stays</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Hotels in Tehran</h1>
        <p className="mt-2 text-sm text-slate-500">
          {prettyDate(dates.startDate)} – {prettyDate(dates.endDate)} · prices for 1 room
        </p>
      </div>
      <p className="text-sm font-semibold text-slate-500">
        {total === undefined ? (
          "Searching properties…"
        ) : (
          <>
            <span className="text-slate-950">{total}</span> properties found
          </>
        )}
      </p>
    </div>
  );
}
