"use client";

import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

type HeaderProps = {
	mobileMenuOpen: boolean;
	onToggleMobileMenu: () => void;
};

const pageTitles: Record<string, string> = {
	"/": "Главная",
	"/passwords": "Пароли",
};

export default function Header({ mobileMenuOpen, onToggleMobileMenu }: HeaderProps) {
	const pathname = usePathname();
	const pageTitle = pageTitles[pathname] ?? "Home Admin";

	return (
		<header className="sticky top-0 z-30 h-16 bg-card/90 backdrop-blur border-b border-line flex items-center justify-between px-4 sm:px-6 lg:px-8">
			<div className="flex items-center gap-3">
				<button
					onClick={onToggleMobileMenu}
					className="p-2 rounded-lg text-ink hover:bg-paper active:bg-line/60 transition-colors lg:hidden"
					aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
				>
					{mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
				</button>
				<h1 className="font-display text-sm sm:text-base lg:text-lg text-ink">{pageTitle}</h1>
			</div>
		</header>
	);
}
