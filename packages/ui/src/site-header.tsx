import type { StayDates } from "./date-utils";
import { DateSearchForm } from "./date-search-form";
import { SharedLink } from "./navigation";

export function SiteHeader({
  dates,
  formAction = "/",
  framework,
}: {
  dates: StayDates;
  formAction?: string;
  framework: "Next.js" | "React Router";
}) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <SharedLink className="flex items-center gap-3" href="/">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-sky-500 text-lg font-black text-white">
            S
          </span>
          <span>
            <span className="block text-lg font-black tracking-tight">Stayfinder</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              {framework} benchmark
            </span>
          </span>
        </SharedLink>
        <span className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 sm:block">
          Tehran · 1 room
        </span>
      </div>

      <div className="mx-auto max-w-7xl px-5 pb-6 sm:px-8">
        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <DateSearchForm action={formAction} defaultDates={dates} />
        </div>
      </div>
    </header>
  );
}
