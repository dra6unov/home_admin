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
		<div className="bg-card px-4 py-3 rounded-xl border border-line space-y-3">
			<UrlInput value={url} onChange={onUrlChange} />
			<div className="h-px bg-line" />
			<div className="flex items-center gap-4">
				<LoginInput value={login} onChange={onLoginChange} />
				<div className="w-px h-8 bg-line" />
				<PasswordInput value={password} onChange={onPasswordChange} />
			</div>
			{onDelete && (
				<button
					type="button"
					onClick={onDelete}
					className="flex items-center gap-1 text-xs text-amber hover:bg-amber/10 rounded-lg px-2 py-1 transition-colors"
				>
					<Trash2 className="w-3.5 h-3.5" />
					Удалить
				</button>
			)}
		</div>
	);
};
