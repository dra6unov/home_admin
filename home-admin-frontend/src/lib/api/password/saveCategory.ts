import { fetchAPI } from "@/lib/helpers/fetchAPI";
import { PasswordCategoriesPageData } from "@/lib/types/password";

export const saveCategory = async (data: PasswordCategoriesPageData): Promise<boolean> => {
	const payload = {
		id: data.id,
		title: data.title,
		passwords: data.passwords,
	};

	try {
		const res = await fetchAPI({
			path: "/passwords/save",
			method: "POST",
			body: payload,
		});

		if (!res.ok) {
			return false;
		}

		return true;
	} catch (e) {
		return false;
	}
};
