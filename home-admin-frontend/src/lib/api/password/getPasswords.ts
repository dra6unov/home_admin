import { fetchAPI } from "@/lib/helpers/fetchAPI";
import { PasswordCategoriesPageData, PasswordCategoriesRequest } from "@/lib/types/password";

export const getPasswords = async (): Promise<PasswordCategoriesPageData[]> => {
	try {
		const res = await fetchAPI<PasswordCategoriesRequest[]>({
			path: "/passwords",
			method: "GET",
		});

		if (!res.ok) {
			return [];
		}

		return (
			res.data?.map(item => ({
				id: item.id,
				title: item.title,
				passwords: item.passwords || [],
				defaultExpanded: false,
			})) || []
		);
	} catch (e) {
		console.log("error while requestig passwords: ", e);

		return [];
	}
};
