"use client";

import { useState, type ReactNode } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";

type AdminLayoutProps = {
	children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
	const [expanded, setExpanded] = useState(true);
	const [mobileOpen, setMobileOpen] = useState(false);

	return (
		<div className="h-full flex">
			<Sidebar
				expanded={expanded}
				mobileOpen={mobileOpen}
				onToggle={() => setExpanded(prev => !prev)}
				onCloseMobile={() => setMobileOpen(false)}
			/>

			<div
				className={`flex-1 flex flex-col transition-all duration-300 motion-reduce:transition-none ${
					expanded ? "lg:ml-60" : "lg:ml-16"
				}`}
			>
				<Header mobileMenuOpen={mobileOpen} onToggleMobileMenu={() => setMobileOpen(prev => !prev)} />

				<main className="flex-1 bg-paper p-3 sm:p-4 lg:p-6 overflow-y-auto">{children}</main>
			</div>
		</div>
	);
}
