"use client";

import { CloudOff, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

type PasswordsErrorProps = {
	message: string;
};

export const PasswordsError = ({ message }: PasswordsErrorProps) => {
	const router = useRouter();

	return (
		<div className="bg-card border border-line rounded-2xl p-8 sm:p-12 flex flex-col items-center text-center gap-4">
			<div className="w-14 h-14 rounded-2xl bg-amber/10 flex items-center justify-center">
				<CloudOff className="w-7 h-7 text-amber" />
			</div>
			<div>
				<h2 className="text-lg font-semibold text-ink">Не удалось загрузить пароли</h2>
				<p className="mt-1 text-sm text-faint">{message}</p>
			</div>
			<button
				type="button"
				onClick={() => router.refresh()}
				className="flex items-center gap-2 bg-pine px-4 py-2 text-sm font-medium text-white rounded-lg hover:bg-pine/90 transition-colors"
			>
				<RefreshCw className="w-4 h-4" />
				Повторить
			</button>
		</div>
	);
};
