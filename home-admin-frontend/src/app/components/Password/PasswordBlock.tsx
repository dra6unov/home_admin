"use client";

import { ChevronDown, CircleX, Plus, Save } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
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
	id,
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
	const bodyId = `password-block-body-${id}`;

	const handleToggle = () => {
		setExpanded(prev => !prev);
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.target !== event.currentTarget) {
			return;
		}

		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			handleToggle();
		}
	};

	return (
		<div className="border border-line rounded-2xl bg-card overflow-hidden">
			<div
				role="button"
				tabIndex={0}
				aria-expanded={expanded}
				aria-controls={bodyId}
				onClick={handleToggle}
				onKeyDown={handleKeyDown}
				className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 cursor-pointer select-none ${
					expanded ? "bg-pine-deep" : "transition-colors hover:bg-paper"
				}`}
			>
				<ChevronDown
					className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 motion-reduce:transition-none ${
						expanded ? "rotate-180 text-white/60" : "text-faint"
					}`}
					aria-hidden="true"
				/>

				<input
					className={`flex-1 min-w-0 bg-transparent outline-none border-b-2 border-transparent font-semibold text-base sm:text-lg py-1 ${
						expanded
							? "text-white placeholder:text-white/40 focus:border-white/50"
							: "text-ink placeholder:text-faint focus:border-pine/50"
					}`}
					value={title}
					onChange={event => onTitleChange(event.target.value)}
					onClick={event => event.stopPropagation()}
					onDoubleClick={event => event.stopPropagation()}
					aria-label="Название категории"
				/>

				<button
					type="button"
					onClick={event => {
						event.stopPropagation();
						onDeleteBlock();
					}}
					className={`p-1.5 rounded-lg transition-colors ${
						expanded ? "text-white/60 hover:text-white hover:bg-white/10" : "text-amber hover:bg-amber/10"
					}`}
					aria-label="Удалить категорию"
				>
					<CircleX className="w-5 h-5" />
				</button>
			</div>

			<div
				id={bodyId}
				className={`grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none ${
					expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
				}`}
			>
				<div className="overflow-hidden">
					<div className="bg-paper p-3 sm:p-4 space-y-2">
						{items.map(item => (
							<PasswordItem
								key={item.id}
								login={item.login}
								password={item.password}
								url={item.url}
								onUrlChange={value => onItemChange(item.id, "url", value)}
								onLoginChange={value => onItemChange(item.id, "login", value)}
								onPasswordChange={value => onItemChange(item.id, "password", value)}
								onDelete={() => onDeleteItem(item.id)}
							/>
						))}

						<div className="flex items-center justify-center gap-2 sm:gap-3 pt-1">
							<button
								type="button"
								onClick={onAddItem}
								className="flex items-center gap-2 border border-line bg-card px-4 py-2 text-sm text-faint hover:text-ink rounded-lg transition-colors"
							>
								<Plus className="w-4 h-4" />
								Добавить
							</button>

							<button
								type="button"
								onClick={onSaveBlock}
								disabled={saving}
								className="flex items-center gap-2 bg-pine px-4 py-2 text-sm font-medium text-white rounded-lg hover:bg-pine/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<Save className="w-4 h-4" />
								{saving ? "Сохранение..." : "Сохранить"}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
