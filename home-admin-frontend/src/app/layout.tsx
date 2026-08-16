import type { Metadata } from "next";
import { Golos_Text, JetBrains_Mono, Unbounded } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import AdminLayout from "./AdminLayout";

const unbounded = Unbounded({
	variable: "--font-unbounded",
	subsets: ["cyrillic", "latin"],
});

const golosText = Golos_Text({
	variable: "--font-golos-text",
	subsets: ["cyrillic", "latin"],
});

const jetbrainsMono = JetBrains_Mono({
	variable: "--font-jetbrains-mono",
	subsets: ["cyrillic", "latin"],
});

export const metadata: Metadata = {
	title: "Home Admin",
	description: "Админ-панель",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html
			lang="ru"
			className={`${unbounded.variable} ${golosText.variable} ${jetbrainsMono.variable} h-full antialiased`}
		>
			<body className="h-full flex flex-col">
				<AdminLayout>{children}</AdminLayout>
				<Toaster />
			</body>
		</html>
	);
}
