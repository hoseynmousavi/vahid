import type {AboutContent} from "./about-page"

export const ABOUT_API_URL = "http://localhost:4000/api/about"

export async function fetchAboutContent(
    init?: RequestInit,
    query?: string,
): Promise<AboutContent> {
    const response = await fetch(`${ABOUT_API_URL}${query ? "?" + query : ""}`, init)

    if (!response.ok) {
        throw new Error(`About API failed with status ${response.status}`)
    }

    const payload = (await response.json()) as { data?: AboutContent }

    if (!payload.data) {
        throw new Error("The About API returned an invalid response")
    }

    return payload.data
}
