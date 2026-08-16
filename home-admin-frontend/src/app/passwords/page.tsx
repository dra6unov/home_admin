import ClientPasswords from "./ClientPasswords";
import { PasswordsError } from "../components/PasswordsError/PasswordsError";
import { getPasswords } from "@/lib/api/password/getPasswords";
import { PasswordCategoriesPageData } from "@/lib/types/password";

export default async function Page() {
	let data: PasswordCategoriesPageData[] | null = null;
	let error: string | null = null;

	try {
		data = await getPasswords();
	} catch (e) {
		console.log("error while requesting passwords: ", e);
		error = e instanceof Error ? e.message : "Не удалось получить пароли";
	}

	if (error) {
		return <PasswordsError message={error} />;
	}

	if (data === null) {
		return <PasswordsError message="Не удалось получить пароли" />;
	}

	return <ClientPasswords data={data} />;
}
