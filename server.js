const http = require("node:http")
const {
    constants,
    brotliCompressSync,
    gzipSync,
} = require("node:zlib")

const PORT = Number(process.env.PORT) || 4000

const aboutContent = {
    brand: "stayfinder",
    navigation: {
        findStay: "Find a stay",
        story: "Our story",
        values: "Our values",
        explore: "Explore stays",
    },
    artwork: {
        fieldNote: "Stayfinder field note",
        headline: "Find the place that stays with you.",
        location: "Tehran",
        badge: ["Made for", "good stays"],
        postcard: "Postcard no. 07",
        coordinates: "35.6892° N",
    },
    hero: {
        eyebrow: "Our story",
        titleFirstLine: "Travel far.",
        titleSecondLine: "Feel",
        titleHighlight: "at home.",
        description:
            "We help curious people find places with a pulse—thoughtful stays rooted in their neighbourhoods, hosted by people who care.",
        storyButton: "Read our story",
        independentLabel: "Independent since 2018",
    },
    stats: [
        {value: "140k+", label: "nights made memorable"},
        {value: "230+", label: "independent hotel partners"},
        {value: "4.9 / 5", label: "average traveller rating"},
    ],
    story: {
        eyebrow: "Why we began",
        title: "Booking a room is easy. Finding a place you’ll remember is not.",
        paragraphs: [
            "Stayfinder started after one too many trips planned through endless tabs, vague listings, and recommendations that all looked the same. We knew there had to be a more human way.",
            "So we built the travel guide we wanted ourselves: edited with taste, powered by honest information, and tuned to the tiny details that turn a booking into a story worth retelling.",
        ],
        founderInitials: "NM",
        founders: "Nika & Mani",
        founderDescription: "Co-founders, fellow window-seat people",
    },
    values: {
        eyebrow: "What guides us",
        title: "Principles we pack.",
        description:
            "Three simple ideas shape every hotel we choose, every feature we build, and every traveller we help.",
        items: [
            {
                number: "01",
                title: "Clarity over clutter",
                copy: "We surface the details that matter and leave the fine print where it belongs: out in the open.",
            },
            {
                number: "02",
                title: "Local by design",
                copy: "Our recommendations begin with neighbourhood knowledge, not a generic global ranking.",
            },
            {
                number: "03",
                title: "Human, always",
                copy: "Travel is personal. Our product and support are built to feel thoughtful at every turn.",
            },
        ],
    },
    journey: {
        eyebrow: "How we got here",
        title: "A journey worth taking.",
        milestones: [
            {year: "2018", text: "A sketch, two backpacks and one shared belief."},
            {year: "2020", text: "Our first 10,000 stays booked across Iran."},
            {year: "2023", text: "A nationwide network of independent hotel partners."},
            {year: "Today", text: "A small team making big trips feel beautifully simple."},
        ],
    },
    callToAction: {
        eyebrow: "Your next chapter",
        title: "Go somewhere that changes your view.",
        description:
            "Handpicked hotels, honest details, and a smoother way from daydream to check-in.",
        button: "Find your stay",
    },
    footer: {
        note: "Made for curious people, from Tehran with care.",
        story: "Story",
        values: "Values",
        hotels: "Hotels",
    },
}

function acceptsEncoding(header, encoding) {
    return header
        .split(",")
        .map((value) => value.trim().split(";"))
        .some(([name, ...parameters]) => {
            if (name !== encoding && name !== "*") return false

            const quality = parameters
                .map((parameter) => parameter.trim())
                .find((parameter) => parameter.startsWith("q="))

            return quality === undefined || Number(quality.slice(2)) > 0
        })
}

function compress(body, acceptEncoding) {
    if (body.length < 1024) return {body}

    if (acceptsEncoding(acceptEncoding, "br")) {
        return {
            body: brotliCompressSync(body, {
                params: {[constants.BROTLI_PARAM_QUALITY]: 4},
            }),
            encoding: "br",
        }
    }

    if (acceptsEncoding(acceptEncoding, "gzip")) {
        return {body: gzipSync(body, {level: 6}), encoding: "gzip"}
    }

    return {body}
}

function sendJson(request, response, statusCode, payload) {
    const source = Buffer.from(JSON.stringify(payload))
    const result = compress(source, request.headers["accept-encoding"] || "")
    const headers = {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
        "Content-Length": result.body.length,
        "Content-Type": "application/json; charset=utf-8",
        "Vary": "Accept-Encoding",
    }

    if (result.encoding) headers["Content-Encoding"] = result.encoding

    response.writeHead(statusCode, headers)
    response.end(result.body)
}

const server = http.createServer((request, response) => {
    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`)

    if (request.method === "OPTIONS") {
        response.writeHead(204, {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Origin": "*",
        })
        response.end()
        return
    }

    if (request.method === "GET" && url.pathname === "/api/about") {
        setTimeout(() => {
            console.log("i've been called")
            sendJson(request, response, 200, {data: aboutContent})
        }, 3000)
        return
    }

    if (request.method === "GET" && url.pathname === "/api/health") {
        sendJson(request, response, 200, {status: "ok"})
        return
    }

    sendJson(request, response, 404, {error: "Not found"})
})

server.listen(PORT, "127.0.0.1", () => {
    console.log(`About API listening at http://localhost:${PORT}`)
})
