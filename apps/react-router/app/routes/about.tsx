import {ClientAboutPage, fetchAboutContent} from "@stack/ui"
import type {Route} from "./+types/about"

export function meta({}: Route.MetaArgs) {
    return [
        {title: "Our Story | Stayfinder"},
        {
            name: "description",
            content: "Meet Stayfinder and discover how we make memorable stays easier to find.",
        },
    ]
}

export async function loader() {
    return {data: await fetchAboutContent()}
}

export function clientLoader() {
    return null
}

export default function About({loaderData}: Route.ComponentProps) {
    return <ClientAboutPage initialContent={loaderData?.data}/>
}
