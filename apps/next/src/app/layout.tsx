import type {Metadata} from "next"
import "./globals.css"

export const metadata: Metadata = {
    title: "Hotels in Tehran | Stayfinder",
    description: "Compare Tehran hotels, ratings, rooms, and nightly prices.",
}

export default function RootLayout({children}: LayoutProps<"/">) {
    return (
        <html lang="en">
        <body>
        {children}
        </body>
        </html>
    )
}
