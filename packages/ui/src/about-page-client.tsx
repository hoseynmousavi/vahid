"use client"

import {useQuery} from "@tanstack/react-query"
import {useEffect, useState} from "react"
import {fetchAboutContent} from "./about-api"
import {AboutPage, type AboutContent} from "./about-page"

export function ClientAboutPage({
                                    initialContent,
                                }: {
    initialContent?: AboutContent;
}) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    const about = useQuery({
        queryKey: ["about"],
        queryFn: ({signal}) => {
            return fetchAboutContent({cache: "no-store", signal}, "ok")
                .then(() => {
                    return fetchAboutContent({cache: "no-store", signal}, "wow")
                        .then(data => {
                            return data
                        })
                })
        },
        initialData: initialContent,
        enabled: initialContent !== undefined || mounted,
    })

    if (about.isPending) {
        return (
            <main
                aria-busy="true"
                aria-live="polite"
                className="min-h-screen bg-[#fffaf1] px-5 py-20 text-[#17352b] sm:px-8"
            >
                <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
                    <div className="space-y-6 pt-16">
                        <div className="h-9 w-32 animate-pulse rounded-full bg-[#17352b]/10"/>
                        <div className="h-20 w-full max-w-lg animate-pulse rounded-3xl bg-[#17352b]/10"/>
                        <div className="h-20 w-4/5 max-w-md animate-pulse rounded-3xl bg-[#df765c]/15"/>
                        <div className="h-6 w-full max-w-xl animate-pulse rounded bg-[#17352b]/10"/>
                        <div className="h-6 w-3/4 max-w-lg animate-pulse rounded bg-[#17352b]/10"/>
                    </div>
                    <div className="aspect-[4/5] w-full max-w-[570px] animate-pulse rounded-[2.5rem] bg-[#d9e6de]"/>
                </div>
                <span className="sr-only">Loading the About page</span>
            </main>
        )
    }

    if (about.isError) {
        return (
            <main className="grid min-h-screen place-items-center bg-[#fffaf1] px-5 text-center text-[#17352b]">
                <div className="max-w-md rounded-[2rem] border border-[#df765c]/30 bg-white/60 p-8">
                    <h1 className="text-2xl font-black">We couldn’t load our story.</h1>
                    <p className="mt-3 text-[#60736c]">{about.error.message}</p>
                    <button
                        className="mt-6 rounded-full bg-[#17352b] px-6 py-3 text-sm font-bold text-white"
                        onClick={() => about.refetch()}
                        type="button"
                    >
                        Try again
                    </button>
                </div>
            </main>
        )
    }

    return <AboutPage content={about.data}/>
}
