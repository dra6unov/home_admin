"use client";

import { Copy } from "lucide-react";
import { useState } from "react";

type LoginInputProps = {
	value: string;
	onChange?: (value: string) => void;
};

export const LoginInput = ({ value, onChange }: LoginInputProps) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(value);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<div className="flex-1 min-w-0">
			<label className="block text-xs text-faint mb-1">Логин</label>
			<div className="flex items-center gap-2">
				<input
					className="w-full text-ink font-mono text-sm bg-transparent border-none outline-none"
					type="text"
					value={value}
					autoComplete="off"
					autoCapitalize="off"
					autoCorrect="off"
					onChange={event => onChange?.(event.target.value)}
				/>
				<button
					type="button"
					onClick={handleCopy}
					className="p-1 rounded hover:bg-line transition-colors shrink-0"
					aria-label="Скопировать логин"
				>
					<Copy className={`w-4 h-4 transition-colors ${copied ? "text-pine" : "text-faint"}`} />
				</button>
			</div>
		</div>
	);
};
