"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { getGoogleSuggestions } from "@/lib/api/googleSuggestions";

const DEBOUNCE_MS = 250;
const MIN_QUERY_LENGTH = 2;

function useDebounce(value: string, delay: number) {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => clearTimeout(timeout);
	}, [value, delay]);

	return debouncedValue;
}

export default function GoogleSearch() {
	const [value, setValue] = useState("");
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const [activeIndex, setActiveIndex] = useState(-1);
	const [isLoading, setIsLoading] = useState(false);

	const wrapperRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const debouncedValue = useDebounce(value, DEBOUNCE_MS);

	useEffect(() => {
		const query = debouncedValue.trim();

		if (query.length < MIN_QUERY_LENGTH) {
			return;
		}

		const controller = new AbortController();

		const loadSuggestions = async () => {
			try {
				setIsLoading(true);

				const result = await getGoogleSuggestions(query, controller.signal);

				if (!controller.signal.aborted) {
					setSuggestions(result);
				}
			} catch (error) {
				if (error instanceof DOMException && error.name === "AbortError") {
					return;
				}

				if (!controller.signal.aborted) {
					setSuggestions([]);
				}
			} finally {
				if (!controller.signal.aborted) {
					setIsLoading(false);
				}
			}
		};

		loadSuggestions();

		return () => {
			controller.abort();
		};
	}, [debouncedValue]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
				setSuggestions([]);
				setActiveIndex(-1);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const selectSuggestion = useCallback((suggestion: string) => {
		setValue(suggestion);
		setSuggestions([]);
		setActiveIndex(-1);

		inputRef.current?.focus();
	}, []);

	const handleChange = (value: string) => {
		setValue(value);
		setActiveIndex(-1);

		if (value.trim().length < MIN_QUERY_LENGTH) {
			setSuggestions([]);
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (!suggestions.length) {
			return;
		}

		switch (event.key) {
			case "ArrowDown": {
				event.preventDefault();

				setActiveIndex(current => {
					if (current >= suggestions.length - 1) {
						return 0;
					}

					return current + 1;
				});

				break;
			}

			case "ArrowUp": {
				event.preventDefault();

				setActiveIndex(current => {
					if (current <= 0) {
						return suggestions.length - 1;
					}

					return current - 1;
				});

				break;
			}

			case "Enter": {
				if (activeIndex < 0) {
					return;
				}

				event.preventDefault();

				const suggestion = suggestions[activeIndex];

				selectSuggestion(suggestion);

				requestAnimationFrame(() => {
					inputRef.current?.form?.requestSubmit();
				});

				break;
			}

			case "Escape": {
				event.preventDefault();

				setSuggestions([]);
				setActiveIndex(-1);

				break;
			}
		}
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		if (!value.trim()) {
			event.preventDefault();

			return;
		}

		setSuggestions([]);
		setActiveIndex(-1);
	};

	return (
		<div ref={wrapperRef} className="relative">
			<form
				action="https://www.google.com/search"
				method="GET"
				target="_blank"
				onSubmit={handleSubmit}
				className="rounded-2xl border border-line bg-card p-4 sm:p-6"
			>
				<p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-faint">
					Поиск в Google
				</p>

				<div className="flex gap-2">
					<div className="relative flex-1">
						<input
							ref={inputRef}
							name="q"
							type="search"
							value={value}
							onChange={event => handleChange(event.target.value)}
							onKeyDown={handleKeyDown}
							autoComplete="off"
							placeholder="Введите запрос..."
							className="w-full rounded-lg border border-line bg-transparent px-4 py-2 pr-16 text-sm text-ink outline-none placeholder:text-faint focus:border-pine focus:ring-2 focus:ring-pine/30 transition-colors [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
						/>

						{suggestions.length > 0 && (
							<ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-line bg-card py-1 shadow-lg">
								{suggestions.map((suggestion, index) => {
									const isActive = index === activeIndex;

									return (
										<li key={`${suggestion}-${index}`}>
											<button
												type="button"
												className={`w-full px-4 py-2 text-left text-sm transition-colors ${
													isActive ? "bg-pine/10 text-pine" : "text-ink hover:bg-paper"
												}`}
												onMouseDown={event => {
													event.preventDefault();

													selectSuggestion(suggestion);

													requestAnimationFrame(() => {
														inputRef.current?.form?.requestSubmit();
													});
												}}
												onMouseEnter={() => {
													setActiveIndex(index);
												}}
											>
												{suggestion}
											</button>
										</li>
									);
								})}
							</ul>
						)}

						{isLoading && (
							<div className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-faint">
								Поиск...
							</div>
						)}
					</div>

					<button
						type="submit"
						className="rounded-lg bg-pine px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-pine/90"
					>
						Найти
					</button>
				</div>
			</form>
		</div>
	);
}
