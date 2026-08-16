"use client";

import { Copy, Eye } from "lucide-react";
import { useState } from "react";

type PasswordInputProps = {
	value: string;
	onChange?: (value: string) => void;
};

export const PasswordInput = ({ value, onChange }: PasswordInputProps) => {
	const [copied, setCopied] = useState(false);
	const [visible, setVisible] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(value);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<div className="flex-1 min-w-0">
			<label className="block text-xs text-faint mb-1">Пароль</label>
			<div className="flex items-center gap-2">
				<input
					className="w-full text-ink font-mono text-sm bg-transparent border-none outline-none"
					type={visible ? "text" : "password"}
					value={value}
					autoComplete="new-password"
					onChange={event => onChange?.(event.target.value)}
				/>
				<button
					type="button"
					onClick={() => setVisible(!visible)}
					className="p-1 rounded hover:bg-line transition-colors shrink-0"
					aria-label={visible ? "Скрыть пароль" : "Показать пароль"}
				>
					<Eye className={`w-4 h-4 transition-colors ${visible ? "text-pine" : "text-faint"}`} />
				</button>
				<button
					type="button"
					onClick={handleCopy}
					className="p-1 rounded hover:bg-line transition-colors shrink-0"
					aria-label="Скопировать пароль"
				>
					<Copy className={`w-4 h-4 transition-colors ${copied ? "text-pine" : "text-faint"}`} />
				</button>
			</div>
		</div>
	);
};
