type FetchApiRequest = {
	path: string;
	method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	body?: unknown;
	cache?: RequestCache;
};

export const fetchAPI = async <T>({
	path,
	method,
	body,
	cache = "no-store",
}: FetchApiRequest): Promise<T> => {
	const url = process.env.NEXT_PUBLIC_BASE_BACKEND_URL + path;
	console.log("url: ", url);

	try {
		const response = await fetch(url, {
			method,
			headers: {
				"Content-Type": "application/json",
			},
			...(body ? { body: JSON.stringify(body) } : {}),
			cache,
		});

		return response.json();
	} catch (e) {
		console.log(e);

		throw new Error("error while request to backend");
	}
};
