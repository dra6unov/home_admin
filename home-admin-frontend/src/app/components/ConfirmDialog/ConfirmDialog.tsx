"use client";

import { useEffect, useRef } from "react";

type ConfirmDialogProps = {
	title: string;
	message: string;
	confirmLabel?: string;
	cancelLabel?: string;
	tone?: "default" | "danger";
	onConfirm: () => void;
	onCancel: () => void;
};

export const ConfirmDialog = ({
	title,
	message,
	confirmLabel = "Подтвердить",
	cancelLabel = "Отмена",
	tone = "default",
	onConfirm,
	onCancel,
}: ConfirmDialogProps) => {
	const cancelRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const handleKeyDown = (event: globalThis.KeyboardEvent) => {
			if (event.key === "Escape") {
				onCancel();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		cancelRef.current?.focus();

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [onCancel]);

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
			onClick={onCancel}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="confirm-dialog-title"
				aria-describedby="confirm-dialog-message"
				className="w-full max-w-sm bg-card rounded-2xl border border-line shadow-lg p-5 sm:p-6"
				onClick={event => event.stopPropagation()}
			>
				<h2 id="confirm-dialog-title" className="text-lg font-semibold text-ink">
					{title}
				</h2>
				<p id="confirm-dialog-message" className="mt-2 text-sm text-faint">
					{message}
				</p>
				<div className="mt-5 flex justify-end gap-2">
					<button
						ref={cancelRef}
						type="button"
						onClick={onCancel}
						className="px-4 py-2 text-sm text-ink border border-line rounded-lg hover:bg-paper transition-colors"
					>
						{cancelLabel}
					</button>
					<button
						type="button"
						onClick={onConfirm}
						className={`px-4 py-2 text-sm text-white rounded-lg transition-colors ${
							tone === "danger" ? "bg-amber hover:bg-amber/90" : "bg-pine hover:bg-pine/90"
						}`}
					>
						{confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
};
