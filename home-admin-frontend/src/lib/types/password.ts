export type PasswordCategoriesRequest = {
	id: string;
	title: string;
	passwords: PasswordData[];
};

export type PasswordData = {
	id: string;
	url: string;
	login: string;
	password: string;
};

export type PasswordCategoriesPageData = PasswordCategoriesRequest & {
	defaultExpanded?: boolean;
};
