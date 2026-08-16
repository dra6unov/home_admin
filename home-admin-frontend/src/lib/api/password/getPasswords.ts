import { fetchAPI } from "@/lib/helpers/fetchAPI";
import { PasswordCategoriesPageData, PasswordCategoriesRequest } from "@/lib/types/password";

export const getPasswords = async (): Promise<PasswordCategoriesPageData[]> => {
	let res: Awaited<ReturnType<typeof fetchAPI<PasswordCategoriesRequest[]>>>;

	try {
		res = await fetchAPI<PasswordCategoriesRequest[]>({
			path: "/passwords",
			method: "GET",
		});
	} catch (e) {
		console.log("error while requesting passwords: ", e);

		throw new Error("Нет соединения с бэкендом");
	}

	if (!res.ok) {
		throw new Error(`Бэкенд ответил ошибкой ${res.status}`);
	}

	return (
		res.data?.map(item => ({
			id: item.id,
			title: item.title,
			passwords: item.passwords || [],
		})) || []
	);
};
