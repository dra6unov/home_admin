"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings, Key, ChevronLeft, ChevronRight, Box, BrainCog } from "lucide-react";

type NavItem = {
	label: string;
	href: string;
	icon: React.ElementType;
	target?: string;
};

const navItems: NavItem[] = [
	{ label: "Главная", href: "/", icon: Home },
	{ label: "Пароли", href: "/passwords", icon: Key },
	{ label: "Заметки", href: "/zametki", icon: Box },
	{ label: "Настройки", href: "/settings", icon: Settings },
	{
		label: "IvanGPT",
		href: "http://192.168.1.62:11434/",
		icon: BrainCog,
		target: "_blank",
	},
];

type SidebarProps = {
	expanded: boolean;
	mobileOpen: boolean;
	onToggle: () => void;
	onCloseMobile: () => void;
};

export default function Sidebar({ expanded, mobileOpen, onToggle, onCloseMobile }: SidebarProps) {
	const pathname = usePathname();

	return (
		<>
			{mobileOpen && (
				<div className="fixed inset-0 z-40 bg-ink/50 lg:hidden" onClick={onCloseMobile} />
			)}

			<aside
				className={`fixed top-0 left-0 z-50 h-full bg-pine-deep text-white transition-all duration-300 motion-reduce:transition-none flex flex-col ${
					expanded ? "w-60" : "w-16"
				} ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
			>
				<div
					className={`flex items-center h-16 border-b border-white/10 ${
						expanded ? "justify-between px-4" : "justify-center px-0"
					}`}
				>
					{expanded && <span className="font-display text-sm tracking-wide text-white">Home Admin</span>}
					<button
						onClick={onToggle}
						className={`p-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white active:bg-white/20 transition-colors ${
							expanded ? "" : "hidden lg:flex"
						}`}
						aria-label={expanded ? "Свернуть меню" : "Развернуть меню"}
					>
						{expanded ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
					</button>
				</div>

				<nav className="flex-1 py-4 overflow-y-auto">
					<ul className="space-y-1 px-2">
						{navItems.map(item => {
							const Icon = item.icon;
							const isActive = pathname === item.href;

							return (
								<li key={item.href}>
									<Link
										href={item.href}
										target={item.target ?? "_self"}
										onClick={onCloseMobile}
										aria-current={isActive ? "page" : undefined}
										className={`relative flex items-center gap-3 rounded-full px-3 py-2.5 transition-colors motion-reduce:transition-none ${
											expanded ? "" : "justify-center"
										} ${isActive ? "bg-pine text-white" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
										title={!expanded ? item.label : undefined}
									>
										<Icon className="w-5 h-5 flex-shrink-0" />
										{expanded && <span className="flex-1 text-sm">{item.label}</span>}
									</Link>
								</li>
							);
						})}
					</ul>
				</nav>

				<div className="border-t border-white/10 p-3">
					<div className={`flex items-center gap-2 ${expanded ? "" : "justify-center"}`}>
						<span className="relative flex h-2 w-2" aria-hidden="true">
							<span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping motion-reduce:animate-none" />
							<span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
						</span>
						{expanded && <span className="font-mono text-xs text-white/50">дом · v0.1.0</span>}
					</div>
				</div>
			</aside>
		</>
	);
}
