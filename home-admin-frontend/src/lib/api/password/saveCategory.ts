import { fetchAPI } from "@/lib/helpers/fetchAPI";
import { PasswordCategoriesPageData } from "@/lib/types/password";

export const saveCategory = async (data: PasswordCategoriesPageData): Promise<boolean> => {
	const payload = {
		id: data.id,
		title: data.title,
		passwords: data.passwords,
	};

	console.log("payload: ", payload);

	try {
		const res = await fetchAPI({
			path: "/password/category",
			method: "POST",
			body: payload,
		});

		console.log("saveCategory res: ", res);

		return true;
	} catch (e) {
		return false;
	}
};
