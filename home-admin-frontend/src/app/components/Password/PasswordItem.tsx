"use client";

import { Trash2 } from "lucide-react";
import { LoginInput } from "./LoginInput";
import { PasswordInput } from "./PasswordInput";
import { UrlInput } from "./UrlInput";

type PasswordItemProps = {
	login?: string;
	password?: string;
	url?: string;
	onDelete?: () => void;
	onUrlChange?: (value: string) => void;
	onLoginChange?: (value: string) => void;
	onPasswordChange?: (value: string) => void;
};

export const PasswordItem = ({
	login = "",
	password = "",
	url = "",
	onDelete,
	onUrlChange,
	onLoginChange,
	onPasswordChange,
}: PasswordItemProps) => {
	return (
		<div className="bg-white px-4 py-3 rounded-xl border border-gray-200 space-y-3">
			<UrlInput value={url} onChange={onUrlChange} />
			<div className="h-px bg-gray-200" />
			<div className="flex items-center gap-4">
				<LoginInput value={login} onChange={onLoginChange} />
				<div className="w-px h-8 bg-gray-200" />
				<PasswordInput value={password} onChange={onPasswordChange} />
			</div>
			{onDelete && (
				<button
					onClick={onDelete}
					className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg px-2 py-1 transition-colors"
				>
					<Trash2 className="w-3.5 h-3.5" />
					Удалить
				</button>
			)}
		</div>
	);
};
