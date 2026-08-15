type FetchApiRequest = {
	path: string;
	method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	body?: unknown;
	cache?: RequestCache;
};

type FetchApiResponse<T> = {
	data: T | null;
	status: number;
	ok: boolean;
};

export const fetchAPI = async <T>({
	path,
	method,
	body,
	cache = "no-store",
}: FetchApiRequest): Promise<FetchApiResponse<T>> => {
	const url = process.env.NEXT_PUBLIC_BASE_BACKEND_URL + path;

	try {
		const response = await fetch(url, {
			method,
			headers: {
				"Content-Type": "application/json",
			},
			...(body !== undefined ? { body: JSON.stringify(body) } : {}),
			cache,
		});

		let data: T | null = null;

		if (response.status !== 204) {
			const contentType = response.headers.get("content-type");

			if (contentType?.includes("application/json")) {
				data = await response.json();
			}
		}

		return {
			data,
			status: response.status,
			ok: response.ok,
		};
	} catch (e) {
		console.error(e);

		throw new Error("Error while requesting backend");
	}
};
