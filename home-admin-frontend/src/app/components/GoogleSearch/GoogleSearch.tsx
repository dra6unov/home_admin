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
				className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
			>
				<h2 className="mb-3 text-lg font-bold text-gray-900 sm:text-xl">Поиск в Google</h2>

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
							className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
						/>

						{suggestions.length > 0 && (
							<ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
								{suggestions.map((suggestion, index) => {
									const isActive = index === activeIndex;

									return (
										<li key={`${suggestion}-${index}`}>
											<button
												type="button"
												className={`w-full px-4 py-2 text-left text-sm ${
													isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
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
							<div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
								Поиск...
							</div>
						)}
					</div>

					<button
						type="submit"
						className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
					>
						Найти
					</button>
				</div>
			</form>
		</div>
	);
}
