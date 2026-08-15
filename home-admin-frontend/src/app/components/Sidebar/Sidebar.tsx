"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings, Key, ChevronLeft, ChevronRight, Box, BrainCog } from "lucide-react";

interface NavItem {
	label: string;
	href: string;
	icon: React.ElementType;
	target?: string;
}

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

interface SidebarProps {
	expanded: boolean;
	mobileOpen: boolean;
	onToggle: () => void;
	onCloseMobile: () => void;
}

export default function Sidebar({ expanded, mobileOpen, onToggle, onCloseMobile }: SidebarProps) {
	const pathname = usePathname();

	return (
		<>
			{mobileOpen && (
				<div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onCloseMobile} />
			)}

			<aside
				className={`fixed top-0 left-0 z-50 h-full bg-gray-900 text-white transition-all duration-300 flex flex-col
          ${expanded ? "w-60" : "w-16"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
			>
				<div
					className={`flex items-center h-16 border-b border-gray-700 ${expanded ? "justify-between px-4" : "justify-center px-0"}`}
				>
					{expanded && <span className="text-lg font-bold tracking-wide">Admin</span>}
					<button
						onClick={onToggle}
						className={`p-2 rounded-lg hover:bg-gray-700 active:bg-gray-600 transition-colors ${expanded ? "" : "hidden lg:flex"}`}
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
										target={item?.target || "_self"}
										onClick={onCloseMobile}
										className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors
                      ${expanded ? "" : "justify-center"}
                      ${
								isActive
									? "bg-gray-700 text-white"
									: "text-gray-300 hover:bg-gray-700 hover:text-white active:bg-gray-600"
								}
                    `}
										title={!expanded ? item.label : undefined}
									>
										<Icon className="w-5 h-5 flex-shrink-0" />
										{expanded && <span>{item.label}</span>}
									</Link>
								</li>
							);
						})}
						{/* <li key={navItems.length + 1}>
              <Link
                href="http://192.168.1.62:11434/"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors text-gray-300 hover:bg-gray-700 hover:text-white active:bg-gray-600"
              >
                IvanGPT
              </Link>
            </li> */}
					</ul>
				</nav>

				<div className={`border-t border-gray-700 p-3 ${expanded ? "" : "hidden"}`}>
					<p className="text-xs text-gray-500">v0.1.0</p>
				</div>
			</aside>
		</>
	);
}
