import GoogleSearch from "@/app/components/GoogleSearch/GoogleSearch";

const cards = [
	{ title: "Пользователи", value: "0", bar: "bg-pine" },
	{ title: "Товары", value: "0", bar: "bg-amber" },
	{ title: "Заказы", value: "0", bar: "bg-slate-500" },
];

export default function Home() {
	return (
		<div className="space-y-4 sm:space-y-6">
			<GoogleSearch />

			<div className="bg-card rounded-2xl border border-line p-4 sm:p-6">
				<h2 className="text-xl sm:text-2xl font-semibold text-ink mb-2">Добро пожаловать!</h2>
				<p className="text-sm sm:text-base text-faint">
					Это стартовая страница админ-панели. Навигация доступна в боковом меню.
				</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
				{cards.map(card => (
					<div
						key={card.title}
						className="bg-card rounded-2xl border border-line p-4 sm:p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:transform-none"
					>
						<p className="text-xs sm:text-sm text-faint">{card.title}</p>
						<p className="font-mono text-2xl sm:text-3xl text-ink mt-1">{card.value}</p>
						<div className={`h-1 mt-3 sm:mt-4 rounded-full ${card.bar}`} />
					</div>
				))}
			</div>
		</div>
	);
}
