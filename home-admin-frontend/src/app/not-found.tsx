import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center text-center py-24 gap-4">
			<span className="font-display text-6xl sm:text-8xl font-bold text-pine">404</span>
			<h1 className="text-xl text-ink">Раздел в разработке</h1>
			<p className="text-sm text-faint">Эта страница пока не готова — загляните позже.</p>
			<Link
				href="/"
				className="mt-2 px-4 py-2 text-sm font-medium bg-pine text-white rounded-lg hover:bg-pine/90 transition-colors"
			>
				На главную
			</Link>
		</div>
	);
}
