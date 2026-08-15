"use client";

import { Copy, ExternalLink } from "lucide-react";
import { useState } from "react";

type UrlInputProps = {
	value: string;
	onChange?: (value: string) => void;
};

export const UrlInput = ({ value, onChange }: UrlInputProps) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(value);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	const handleOpen = () => {
		const url = value.startsWith("http") ? value : `https://${value}`;
		window.open(url, "_blank");
	};

	return (
		<div className="w-full">
			<label className="block text-xs text-gray-500 mb-1">Ссылка</label>
			<div className="flex items-center gap-2">
				<input
					className="w-full text-gray-900 text-sm bg-transparent border-none outline-none"
					type="text"
					value={value}
					onChange={e => onChange?.(e.target.value)}
				/>
				<button
					onClick={handleOpen}
					className="p-1 rounded hover:bg-gray-100 transition-colors shrink-0"
					aria-label="Открыть ссылку"
				>
					<ExternalLink className="w-4 h-4 text-blue-500" />
				</button>
				<button
					onClick={handleCopy}
					className="p-1 rounded hover:bg-gray-100 transition-colors shrink-0"
					aria-label="Скопировать ссылку"
				>
					<Copy
						className={`w-4 h-4 transition-colors ${copied ? "text-green-500" : "text-gray-400"}`}
					/>
				</button>
			</div>
		</div>
	);
};
