import {AboutPage, type AboutContent} from "./about-page"
import type {Metadata} from "next"
import {cacheLife} from "next/cache"

export const metadata: Metadata = {
    title: "Our Story | Stayfinder",
    description: "Meet Stayfinder and discover how we make memorable stays easier to find.",
}

export const instant = false

export default async function About() {
    "use cache"
    cacheLife({revalidate: 10})
    console.log("page")
    const response = await fetch(
        `http://localhost:4000/api/about?ok`,
        {cache: "no-store"},
    )

    const payload = (await response.json()) as { data: AboutContent }

    return <AboutPage content={payload.data}/>
}

