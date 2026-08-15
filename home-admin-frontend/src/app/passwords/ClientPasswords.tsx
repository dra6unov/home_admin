"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { PasswordBlock } from "../components/Password";
import { PasswordCategoriesPageData } from "@/lib/types/password";
import { saveCategory } from "@/lib/api/password/saveCategory";
import { deletePassword } from "@/lib/api/password/deletePassword";
import { showSuccessToast, showErrorToast } from "@/lib/helpers/toast";

type ClientPasswordsProps = {
	data: PasswordCategoriesPageData[];
};

export default function ClientPasswords({ data }: ClientPasswordsProps) {
	const [blocks, setBlocks] = useState<PasswordCategoriesPageData[]>(data);
	const generateId = () => crypto.randomUUID();

	const handleCreate = () => {
		setBlocks([
			...blocks,
			{
				id: generateId(),
				title: "Новая категория",
				passwords: [{ id: generateId(), url: "", login: "", password: "" }],
				defaultExpanded: true,
			},
		]);
	};

	return (
		<div className="space-y-3 sm:space-y-4">
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
				<h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Пароли</h1>
			</div>

			<div className="flex space-x-2">
				<button
					onClick={handleCreate}
					className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
				>
					<Plus className="w-5 h-5" />
					Создать
				</button>
			</div>

			<div className="space-y-2">
				{blocks.map((block, index) => (
					<PasswordBlock
						key={block.id}
						id={block.id}
						title={block.title}
						items={block.passwords}
						defaultExpanded={block.defaultExpanded}
						onTitleChange={title => {
							const updated = [...blocks];
							updated[index].title = title;
							setBlocks(updated);
						}}
						onAddItem={() => {
							const updated = [...blocks];
							updated[index].passwords = [
								...updated[index].passwords,
								{ id: generateId(), url: "", login: "", password: "" },
							];
							setBlocks(updated);
						}}
						onItemChange={(itemId, field, value) => {
							const updated = [...blocks];
							const password = updated[index].passwords.find(p => p.id === itemId);
							if (password) {
								password[field] = value;
							}
							setBlocks(updated);
						}}
						onDeleteItem={async itemId => {
							const updated = [...blocks];
							updated[index].passwords = updated[index].passwords.filter(item => item.id !== itemId);
							setBlocks(updated);

							const success = await deletePassword(itemId);
							if (success) {
								showSuccessToast("Пароль удален");
							} else {
								showErrorToast("Ошибка при удалении");
							}
						}}
						onDeleteBlock={() => {
							setBlocks(blocks.filter(b => b.id !== block.id));
						}}
						onSaveBlock={async () => {
							const success = await saveCategory(block);
							if (success) {
								showSuccessToast("Категория сохранена");
							} else {
								showErrorToast("Ошибка при сохранении");
							}
						}}
					/>
				))}
			</div>
		</div>
	);
}
