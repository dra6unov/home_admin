export async function getGoogleSuggestions(query: string, signal?: AbortSignal): Promise<string[]> {
	const response = await fetch(`/api/google-suggestions?q=${encodeURIComponent(query)}`, {
		signal,
	});

	if (!response.ok) {
		throw new Error("Failed to fetch Google suggestions");
	}

	return response.json();
}
