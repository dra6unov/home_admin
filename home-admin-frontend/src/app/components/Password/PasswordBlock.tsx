"use client";

import { Plus, Save, CircleX } from "lucide-react";
import { useState } from "react";
import { PasswordItem } from "./PasswordItem";
import { PasswordData } from "@/lib/types/password";

export type PasswordBlockProps = {
	id: string;
	title: string;
	items: PasswordData[];
	onTitleChange: (title: string) => void;
	onAddItem: () => void;
	onItemChange: (itemId: string, field: "url" | "login" | "password", value: string) => void;
	onDeleteItem: (itemId: string) => void;
	onDeleteBlock: () => void;
	onSaveBlock: () => void;
	defaultExpanded?: boolean;
	saving?: boolean;
};

export const PasswordBlock = ({
	title,
	items,
	onTitleChange,
	onAddItem,
	onItemChange,
	onDeleteItem,
	onDeleteBlock,
	onSaveBlock,
	defaultExpanded = false,
	saving = false,
}: PasswordBlockProps) => {
	const [expanded, setExpanded] = useState(defaultExpanded);

	const handleToggle = () => {
		setExpanded(prev => !prev);
	};

	return (
		<div>
			<div
				className={`flex justify-between items-center bg-gray-200 py-2 px-4 ${
					expanded ? "rounded-t-2xl" : "rounded-2xl"
				}`}
				onClick={handleToggle}
			>
				<input
					className="text-gray-900 text-lg font-semibold bg-transparent border-none outline-none"
					value={title}
					onChange={e => onTitleChange(e.target.value)}
					onClick={e => e.stopPropagation()}
				/>

				<button
					type="button"
					onClick={e => {
						e.stopPropagation();
						onDeleteBlock();
					}}
					className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
					aria-label="Удалить категорию"
				>
					<CircleX className="w-5 h-5" />
				</button>
			</div>

			{expanded && (
				<div className="bg-gray-100 space-y-2 rounded-b-2xl pb-2">
					{items.map(item => (
						<PasswordItem
							key={item.id}
							url={item.url}
							login={item.login}
							password={item.password}
							onUrlChange={value => onItemChange(item.id, "url", value)}
							onLoginChange={value => onItemChange(item.id, "login", value)}
							onPasswordChange={value => onItemChange(item.id, "password", value)}
							onDelete={() => onDeleteItem(item.id)}
						/>
					))}

					<div className="flex">
						<button
							type="button"
							onClick={onAddItem}
							className="flex items-center gap-2 mx-auto px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
						>
							<Plus className="w-4 h-4" />
							Добавить
						</button>

						<button
							type="button"
							onClick={onSaveBlock}
							disabled={saving}
							className="flex items-center gap-2 mx-auto px-4 py-2 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<Save className="w-4 h-4" />
							{saving ? "Сохранение..." : "Сохранить"}
						</button>
					</div>
				</div>
			)}
		</div>
	);
};
