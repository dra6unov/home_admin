export default function Loading() {
	return (
		<div className="space-y-3 sm:space-y-4">
			<div className="flex">
				<div className="h-9 w-28 bg-line/60 rounded-xl animate-pulse" />
			</div>
			<div className="space-y-2">
				<div className="h-12 bg-line/60 rounded-2xl animate-pulse" />
				<div className="h-12 bg-line/60 rounded-2xl animate-pulse" />
				<div className="h-12 bg-line/60 rounded-2xl animate-pulse" />
			</div>
		</div>
	);
}
