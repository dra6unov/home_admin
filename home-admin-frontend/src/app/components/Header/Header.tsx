"use client";

import { Menu, X } from "lucide-react";

interface HeaderProps {
	pageTitle: string;
	mobileMenuOpen: boolean;
	onToggleMobileMenu: () => void;
}

export default function Header({ pageTitle, mobileMenuOpen, onToggleMobileMenu }: HeaderProps) {
	return (
		<header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
			<div className="flex items-center gap-3">
				<button
					onClick={onToggleMobileMenu}
					className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 lg:hidden"
					aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
				>
					{mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
				</button>
				<h1 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">{pageTitle}</h1>
			</div>
		</header>
	);
}
