import { fetchAPI } from "@/lib/helpers/fetchAPI";
import { PasswordCategoriesPageData, PasswordCategoriesRequest } from "@/lib/types/password";

export const getPasswords = async (): Promise<PasswordCategoriesPageData[]> => {
	try {
		const data = await fetchAPI<PasswordCategoriesRequest[]>({
			path: "/passwords",
			method: "GET",
		});

		return data.map(item => ({
			id: item.id,
			title: item.title,
			passwords: item.passwords || [],
			defaultExpanded: false,
		}));
	} catch (e) {
		console.log("error while requestig passwords: ", e);

		return [];
	}
};
