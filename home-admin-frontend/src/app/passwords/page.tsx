import ClientPasswords from "./ClientPasswords";
import { getPasswords } from "@/lib/api/password/getPasswords";

export default async function Page() {
	const data = await getPasswords();

	return <ClientPasswords data={data} />;
}
