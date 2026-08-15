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
		<div className="flex-1">
			<label className="block text-xs text-gray-500 mb-1">Пароль</label>
			<div className="flex items-center gap-2">
				<input
					className="w-full text-gray-900 text-sm bg-transparent border-none outline-none"
					type={visible ? "text" : "password"}
					value={value}
					onChange={e => onChange?.(e.target.value)}
				/>
				<button
					onClick={() => setVisible(!visible)}
					className="p-1 rounded hover:bg-gray-100 transition-colors shrink-0"
				>
					<Eye
						className={`w-4 h-4 transition-colors ${visible ? "text-blue-500" : "text-gray-400"}`}
					/>
				</button>
				<button
					onClick={handleCopy}
					className="p-1 rounded hover:bg-gray-100 transition-colors shrink-0"
					aria-label="Скопировать пароль"
				>
					<Copy
						className={`w-4 h-4 transition-colors ${copied ? "text-green-500" : "text-gray-400"}`}
					/>
				</button>
			</div>
		</div>
	);
};
