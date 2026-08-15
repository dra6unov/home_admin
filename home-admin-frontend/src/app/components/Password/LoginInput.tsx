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
		<div className="flex-1">
			<label className="block text-xs text-gray-500 mb-1">Логин</label>
			<div className="flex items-center gap-2">
				<input
					className="w-full text-gray-900 text-sm bg-transparent border-none outline-none"
					type="text"
					value={value}
					onChange={e => onChange?.(e.target.value)}
				/>
				<button
					onClick={handleCopy}
					className="p-1 rounded hover:bg-gray-100 transition-colors shrink-0"
					aria-label="Скопировать логин"
				>
					<Copy
						className={`w-4 h-4 transition-colors ${copied ? "text-green-500" : "text-gray-400"}`}
					/>
				</button>
			</div>
		</div>
	);
};
