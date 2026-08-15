import { NextRequest, NextResponse } from "next/server";

const MIN_QUERY_LENGTH = 2;

export async function GET(request: NextRequest) {
	const query = request.nextUrl.searchParams.get("q")?.trim();

	if (!query || query.length < MIN_QUERY_LENGTH) {
		return NextResponse.json([]);
	}

	const googleUrl =
		"https://suggestqueries.google.com/complete/search" +
		`?client=chrome&q=${encodeURIComponent(query)}`;

	try {
		const response = await fetch(googleUrl, {
			cache: "no-store",
		});

		if (!response.ok) {
			return NextResponse.json({ error: "Failed to fetch Google suggestions" }, { status: 502 });
		}

		const data = await response.json();

		const suggestions = Array.isArray(data?.[1])
			? data[1].filter((item: unknown): item is string => typeof item === "string")
			: [];

		return NextResponse.json(suggestions);
	} catch (error) {
		console.error("Google suggestions error:", error);

		return NextResponse.json({ error: "Failed to fetch Google suggestions" }, { status: 500 });
	}
}
