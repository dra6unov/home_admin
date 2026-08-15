import { fetchAPI } from "@/lib/helpers/fetchAPI";

export const deletePassword = async (id: string): Promise<boolean> => {
	try {
		const res = await fetchAPI({
			path: `/passwords/${id}`,
			method: "DELETE",
		});

		if (res.status !== 204) {
			console.log("error: ", res.data);

			return false;
		}

		return true;
	} catch (e) {
		console.log("error: ", e);

		return false;
	}
};
