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
			<label className="block text-xs text-faint mb-1">Ссылка</label>
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
					onClick={handleOpen}
					className="p-1 rounded hover:bg-line transition-colors shrink-0"
					aria-label="Открыть ссылку"
				>
					<ExternalLink className="w-4 h-4 text-pine" />
				</button>
				<button
					type="button"
					onClick={handleCopy}
					className="p-1 rounded hover:bg-line transition-colors shrink-0"
					aria-label="Скопировать ссылку"
				>
					<Copy className={`w-4 h-4 transition-colors ${copied ? "text-pine" : "text-faint"}`} />
				</button>
			</div>
		</div>
	);
};
