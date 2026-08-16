"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { PasswordBlock } from "../components/Password";
import { ConfirmDialog } from "../components/ConfirmDialog/ConfirmDialog";
import { PasswordCategoriesPageData } from "@/lib/types/password";
import { saveCategory } from "@/lib/api/password/saveCategory";
import { deletePassword } from "@/lib/api/password/deletePassword";
import { showSuccessToast, showErrorToast } from "@/lib/helpers/toast";
import { deleteCategory } from "@/lib/api/password/deleteCategory";

type ClientPasswordsProps = {
	data: PasswordCategoriesPageData[];
};

type PendingDelete = {
	kind: "block" | "item";
	blockId: string;
	itemId?: string;
};

export default function ClientPasswords({ data }: ClientPasswordsProps) {
	const [blocks, setBlocks] = useState<PasswordCategoriesPageData[]>(data);
	const [savingBlockId, setSavingBlockId] = useState<string | null>(null);
	const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);

	const generateId = () => crypto.randomUUID();

	const updateBlock = (
		blockId: string,
		updater: (block: PasswordCategoriesPageData) => PasswordCategoriesPageData
	) => {
		setBlocks(prev => prev.map(block => (block.id === blockId ? updater(block) : block)));
	};

	const handleCreate = () => {
		setBlocks(prev => [
			...prev,
			{
				id: generateId(),
				title: "Новая категория",
				passwords: [{ id: generateId(), url: "", login: "", password: "" }],
				defaultExpanded: true,
			},
		]);
	};

	const handleConfirmDelete = async () => {
		if (!pendingDelete) {
			return;
		}

		if (pendingDelete.kind === "item" && pendingDelete.itemId) {
			const { blockId, itemId } = pendingDelete;
			const success = await deletePassword(itemId);
			setBlocks(prev =>
				prev.map(block =>
					block.id === blockId
						? { ...block, passwords: block.passwords.filter(item => item.id !== itemId) }
						: block
				)
			);
			if (success) {
				showSuccessToast("Пароль удален");
			} else {
				showErrorToast("Ошибка при удалении");
			}
		} else if (pendingDelete.kind === "block") {
			const success = await deleteCategory(pendingDelete.blockId);
			setBlocks(prev => prev.filter(block => block.id !== pendingDelete.blockId));
			if (success) {
				showSuccessToast("Категория удалена");
			} else {
				showErrorToast("Ошибка при удалении категории");
			}
		}

		setPendingDelete(null);
	};

	return (
		<div className="space-y-3 sm:space-y-4">
			<div className="flex">
				<button
					type="button"
					onClick={handleCreate}
					className="flex items-center gap-1 px-4 py-2 bg-pine text-white rounded-xl hover:bg-pine/90 transition-colors"
				>
					<Plus className="w-5 h-5" />
					Создать
				</button>
			</div>

			{blocks.length === 0 ? (
				<div className="bg-card border border-line rounded-2xl p-8 text-center text-faint">
					Категорий пока нет — создайте первую
				</div>
			) : (
				<div className="space-y-2">
					{blocks.map(block => (
						<PasswordBlock
							key={block.id}
							id={block.id}
							title={block.title}
							items={block.passwords}
							defaultExpanded={block.defaultExpanded}
							saving={savingBlockId === block.id}
							onTitleChange={title => updateBlock(block.id, prev => ({ ...prev, title }))}
							onAddItem={() =>
								updateBlock(block.id, prev => ({
									...prev,
									passwords: [...prev.passwords, { id: generateId(), url: "", login: "", password: "" }],
								}))
							}
							onItemChange={(itemId, field, value) =>
								updateBlock(block.id, prev => ({
									...prev,
									passwords: prev.passwords.map(item =>
										item.id === itemId ? { ...item, [field]: value } : item
									),
								}))
							}
							onDeleteItem={itemId => setPendingDelete({ kind: "item", blockId: block.id, itemId })}
							onDeleteBlock={() => setPendingDelete({ kind: "block", blockId: block.id })}
							onSaveBlock={async () => {
								setSavingBlockId(block.id);
								const success = await saveCategory(block);
								setSavingBlockId(null);
								if (success) {
									showSuccessToast("Категория сохранена");
								} else {
									showErrorToast("Ошибка при сохранении");
								}
							}}
						/>
					))}
				</div>
			)}

			{pendingDelete && (
				<ConfirmDialog
					tone="danger"
					title={pendingDelete.kind === "block" ? "Удалить категорию?" : "Удалить пароль?"}
					message={
						pendingDelete.kind === "block"
							? "Категория и все пароли в ней будут удалены."
							: "Пароль будет удален без возможности восстановления."
					}
					confirmLabel="Удалить"
					onConfirm={handleConfirmDelete}
					onCancel={() => setPendingDelete(null)}
				/>
			)}
		</div>
	);
}
