import type { AboutSpotlightContent } from "./about-api";

export function AboutSpotlight({
  content,
}: {
  content: AboutSpotlightContent;
}) {
  return (
    <section className="bg-[#17352b] py-20 text-white sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f6c453]">
          {content.eyebrow}
        </p>
        <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <h2 className="max-w-3xl text-4xl font-black leading-tight tracking-[-0.05em] sm:text-5xl">
            {content.title}
          </h2>
          <p className="leading-7 text-white/65">{content.description}</p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {content.items.map((item) => (
            <div
              className="rounded-3xl border border-white/15 bg-white/5 p-6"
              key={item.label}
            >
              <p className="text-3xl font-black text-[#f6c453]">
                {item.value}
              </p>
              <p className="mt-2 text-sm text-white/65">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutSpotlightLoading() {
  return (
    <section
      aria-busy="true"
      aria-live="polite"
      className="bg-[#17352b] py-20 text-white sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="h-4 w-44 animate-pulse rounded bg-white/15" />
        <div className="mt-6 h-14 max-w-3xl animate-pulse rounded-2xl bg-white/15" />
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              className="h-32 animate-pulse rounded-3xl border border-white/10 bg-white/10"
              key={index}
            />
          ))}
        </div>
        <span className="sr-only">Loading network spotlight</span>
      </div>
    </section>
  );
}
