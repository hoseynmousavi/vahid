import type {ReactNode} from "react"
import {cacheLife} from "next/cache"

export type AboutContent = {
    brand: string;
    navigation: { findStay: string; story: string; values: string; explore: string };
    artwork: {
        fieldNote: string;
        headline: string;
        location: string;
        badge: [string, string];
        postcard: string;
        coordinates: string;
    };
    hero: {
        eyebrow: string;
        titleFirstLine: string;
        titleSecondLine: string;
        titleHighlight: string;
        description: string;
        storyButton: string;
        independentLabel: string;
    };
    stats: Array<{ value: string; label: string }>;
    story: {
        eyebrow: string;
        title: string;
        paragraphs: string[];
        founderInitials: string;
        founders: string;
        founderDescription: string;
    };
    values: {
        eyebrow: string;
        title: string;
        description: string;
        items: Array<{ number: string; title: string; copy: string }>;
    };
    journey: {
        eyebrow: string;
        title: string;
        milestones: Array<{ year: string; text: string }>;
    };
    callToAction: { eyebrow: string; title: string; description: string; button: string };
    footer: { note: string; story: string; values: string; hotels: string };
};

const valueIcons = ["spark", "pin", "heart"] as const

function Mark() {
    return (
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#17352b] text-sm font-black text-[#f6c453]">
      S
    </span>
    )
}

function Icon({name}: { name: "spark" | "pin" | "heart" | "arrow" | "check" }) {
    const paths: Record<typeof name, ReactNode> = {
        spark: <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z"/>,
        pin: (
            <>
                <path d="M18 9c0 5-6 11-6 11S6 14 6 9a6 6 0 1 1 12 0Z"/>
                <circle cx="12" cy="9" r="2"/>
            </>
        ),
        heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>,
        arrow: <path d="M5 12h14m-5-5 5 5-5 5"/>,
        check: <path d="m5 12 4 4L19 6"/>,
    }

    return (
        <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
        >
            {paths[name]}
        </svg>
    )
}

function EditorialCollage({content}: { content: AboutContent["artwork"] }) {
    return (
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[570px]" aria-label="A visual story of travel, place, and" role="img">
            <div className="absolute inset-x-[7%] bottom-[4%] top-[7%] overflow-hidden rounded-[2.5rem] bg-[#d9e6de] shadow-[0_35px_80px_-35px_rgba(23,53,43,0.45)]">
                <div className="absolute inset-0 bg-[linear-gradient(145deg,transparent_45%,rgba(23,53,43,.12)_45.2%,transparent_45.6%),radial-gradient(circle_at_76%_24%,#f6c453_0_9%,transparent_9.3%)]"/>
                <div className="absolute -bottom-[8%] -left-[10%] h-[55%] w-[75%] rounded-[50%] bg-[#76917f]"/>
                <div className="absolute -bottom-[14%] right-[-20%] h-[57%] w-[80%] rounded-[50%] bg-[#17352b]"/>
                <div className="absolute bottom-[27%] left-[28%] h-[28%] w-[9%] rounded-t-full bg-[#f8f1e6]"/>
                <div className="absolute bottom-[27%] left-[36%] h-[19%] w-[25%] rounded-t-[4rem] bg-[#f8f1e6]"/>
                <div className="absolute bottom-[27%] right-[24%] h-[38%] w-[11%] rounded-t-full bg-[#df765c]"/>
                <div className="absolute bottom-[37%] right-[24%] h-[6%] w-[22%] bg-[#df765c]"/>
                <div className="absolute left-[12%] top-[14%] max-w-[13rem] text-[#17352b]">
                    <p className="text-[10px] font-bold uppercase tracking-[0.28em]">{content.fieldNote}</p>
                    <p className="mt-3 text-3xl font-black leading-[0.95] tracking-[-0.05em] sm:text-4xl">{content.headline}</p>
                </div>
                <div className="absolute right-[9%] top-[45%] grid h-16 w-16 place-items-center rounded-full border border-white/50 bg-white/20 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                    {content.location}
                </div>
            </div>

            <div className="absolute bottom-[1%] left-0 w-[44%] rotate-[-4deg] rounded-2xl bg-[#fffaf1] p-3 shadow-xl sm:p-4">
                <div className="aspect-[4/3] overflow-hidden rounded-xl bg-[#eebc8e]">
                    <div className="relative h-full w-full bg-[linear-gradient(32deg,transparent_49%,#17352b_49.5%_54%,transparent_54.5%),linear-gradient(148deg,transparent_45%,#f8f1e6_45.5%_52%,transparent_52.5%)]">
                        <div className="absolute bottom-3 left-3 h-10 w-10 rounded-full bg-[#df765c]"/>
                    </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[#17352b]">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{content.postcard}</span>
                    <span className="font-mono text-xs">{content.coordinates}</span>
                </div>
            </div>

            <div className="absolute right-0 top-0 flex h-24 w-24 rotate-6 items-center justify-center rounded-full bg-[#df765c] text-center text-[10px] font-black uppercase leading-4 tracking-[0.15em] text-white shadow-xl sm:h-28 sm:w-28">
                {content.badge[0]}<br/>{content.badge[1]}
            </div>
        </div>
    )
}

export async function AboutPage({content}: { content: AboutContent }) {
    "use cache"
    cacheLife({revalidate: 3600})

    console.log("wow about")
    return (
        <main className="min-h-screen overflow-hidden bg-[#fffaf1] text-[#17352b] selection:bg-[#f6c453] selection:text-[#17352b]">
            <header className="relative z-20 border-b border-[#17352b]/10">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
                    <a className="flex items-center gap-3" href="/">
                        <Mark/>
                        <span className="text-lg font-black tracking-[-0.04em]">{content.brand}</span>
                    </a>
                    <nav aria-label="Main navigation" className="hidden items-center gap-8 text-sm font-semibold md:flex">
                        <a className="transition hover:text-[#df765c]" href="/">{content.navigation.findStay}</a>
                        <span className="text-[#df765c]">{content.navigation.story}</span>
                        <a className="transition hover:text-[#df765c]" href="#values">{content.navigation.values}</a>
                    </nav>
                    <a className="group inline-flex items-center gap-2 rounded-full bg-[#17352b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#244c3f]" href="/">
                        {content.navigation.explore}
                        <span className="transition-transform group-hover:translate-x-1"><Icon name="arrow"/></span>
                    </a>
                </div>
            </header>

            <section className="relative">
                <div className="pointer-events-none absolute -left-24 top-32 h-56 w-56 rounded-full border-[45px] border-[#f6c453]/30"/>
                <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:py-20">
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#17352b]/15 bg-white/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em]">
                            <span className="h-2 w-2 rounded-full bg-[#df765c]"/> {content.hero.eyebrow}
                        </div>
                        <h1 className="mt-7 max-w-[700px] text-5xl font-black leading-[0.92] tracking-[-0.06em] sm:text-7xl lg:text-[5.4rem]">
                            {content.hero.titleFirstLine}<br/>{content.hero.titleSecondLine} <span className="relative inline-block text-[#df765c]">{content.hero.titleHighlight}
                            <svg aria-hidden="true" className="absolute -bottom-2 left-0 h-3 w-full" preserveAspectRatio="none" viewBox="0 0 200 12"><path d="M2 9C54 1 124 2 198 7" fill="none" stroke="#f6c453" strokeLinecap="round" strokeWidth="7"/></svg></span>
                        </h1>
                        <p className="mt-8 max-w-xl text-lg leading-8 text-[#486259] sm:text-xl">
                            {content.hero.description}
                        </p>
                        <div className="mt-9 flex flex-wrap items-center gap-5">
                            <a className="group inline-flex items-center gap-3 rounded-full bg-[#df765c] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#c95f48]" href="#story">
                                {content.hero.storyButton} <span className="transition-transform group-hover:translate-x-1"><Icon name="arrow"/></span>
                            </a>
                            <p className="flex items-center gap-2 text-sm font-semibold"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#dce9df]"><Icon name="check"/></span>{content.hero.independentLabel}</p>
                        </div>
                    </div>
                    <EditorialCollage content={content.artwork}/>
                </div>
            </section>

            <section className="bg-[#17352b] text-white">
                <div className="mx-auto grid max-w-7xl divide-y divide-white/15 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8">
                    {content.stats.map((stat) => (
                        <div className="py-10 text-center sm:py-12" key={stat.label}>
                            <p className="text-3xl font-black tracking-[-0.04em] text-[#f6c453] sm:text-4xl">{stat.value}</p>
                            <p className="mt-2 text-sm text-white/65">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32" id="story">
                <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#df765c]">{content.story.eyebrow}</p>
                        <h2 className="mt-5 text-4xl font-black leading-tight tracking-[-0.05em] sm:text-5xl">{content.story.title}</h2>
                    </div>
                    <div className="space-y-7 text-lg leading-8 text-[#486259]">
                        {content.story.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                        <div className="flex items-center gap-4 pt-3 text-[#17352b]">
                            <div className="grid h-12 w-12 place-items-center rounded-full bg-[#f6c453] font-black">{content.story.founderInitials}</div>
                            <div><p className="font-bold">{content.story.founders}</p><p className="text-sm text-[#71837d]">{content.story.founderDescription}</p></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#edf1e9] py-24 sm:py-28" id="values">
                <div className="mx-auto max-w-7xl px-5 sm:px-8">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div><p className="text-xs font-black uppercase tracking-[0.24em] text-[#df765c]">{content.values.eyebrow}</p><h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">{content.values.title}</h2></div>
                        <p className="max-w-md leading-7 text-[#5d716a]">{content.values.description}</p>
                    </div>
                    <div className="mt-14 grid gap-5 md:grid-cols-3">
                        {content.values.items.map((value, index) => (
                            <article className="group relative min-h-[330px] overflow-hidden rounded-[2rem] border border-[#17352b]/10 bg-[#fffaf1] p-8 transition duration-300 hover:-translate-y-1 hover:shadow-xl" key={value.number}>
                                <span className="absolute right-6 top-4 text-7xl font-black tracking-[-0.08em] text-[#17352b]/[0.045]">{value.number}</span>
                                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#f6c453] text-[#17352b]"><Icon name={valueIcons[index] ?? "spark"}/></span>
                                <h3 className="mt-20 text-2xl font-black tracking-[-0.04em]">{value.title}</h3>
                                <p className="mt-4 leading-7 text-[#60736c]">{value.copy}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
                <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
                    <div><p className="text-xs font-black uppercase tracking-[0.24em] text-[#df765c]">{content.journey.eyebrow}</p><h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">{content.journey.title}</h2></div>
                    <ol className="relative border-l border-[#17352b]/20">
                        {content.journey.milestones.map((milestone, index) => (
                            <li className="relative pb-10 pl-9 last:pb-0" key={milestone.year}>
                                <span className={`absolute -left-[7px] top-1 h-[13px] w-[13px] rounded-full border-[3px] border-[#fffaf1] ${index === content.journey.milestones.length - 1 ? "bg-[#df765c]" : "bg-[#17352b]"}`}/>
                                <p className="text-sm font-black text-[#df765c]">{milestone.year}</p>
                                <p className="mt-2 text-xl font-bold tracking-[-0.02em]">{milestone.text}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section className="px-5 pb-5 sm:px-8 sm:pb-8">
                <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[#f6c453] px-6 py-20 text-center sm:px-12 sm:py-24">
                    <div className="absolute -left-16 -top-20 h-52 w-52 rounded-full border-[35px] border-[#fffaf1]/40"/>
                    <div className="absolute -bottom-24 -right-12 h-60 w-60 rounded-full bg-[#df765c]/30"/>
                    <div className="relative mx-auto max-w-3xl">
                        <p className="text-xs font-black uppercase tracking-[0.25em]">{content.callToAction.eyebrow}</p>
                        <h2 className="mt-5 text-4xl font-black leading-tight tracking-[-0.055em] sm:text-6xl">{content.callToAction.title}</h2>
                        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[#3c554d]">{content.callToAction.description}</p>
                        <a className="group mt-9 inline-flex items-center gap-3 rounded-full bg-[#17352b] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#244c3f]" href="/">{content.callToAction.button} <span className="transition-transform group-hover:translate-x-1"><Icon name="arrow"/></span></a>
                    </div>
                </div>
            </section>

            <footer className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 text-sm text-[#64766f] sm:flex-row sm:items-center sm:justify-between sm:px-8">
                <div className="flex items-center gap-3 text-[#17352b]"><Mark/><span className="font-black">{content.brand}</span></div>
                <p>{content.footer.note}</p>
                <div className="flex gap-5 font-semibold text-[#17352b]"><a className="hover:text-[#df765c]" href="#story">{content.footer.story}</a><a className="hover:text-[#df765c]" href="#values">{content.footer.values}</a><a className="hover:text-[#df765c]" href="/">{content.footer.hotels}</a></div>
            </footer>
        </main>
    )
}
