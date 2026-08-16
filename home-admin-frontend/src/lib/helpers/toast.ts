import { toast } from "sonner";

export const showSuccessToast = (message: string) => {
	toast.success(message, {
		style: {
			background: "#1f5c46",
			color: "#fff",
		},
	});
};

export const showErrorToast = (message: string) => {
	toast.error(message, {
		style: {
			background: "#b91c1c",
			color: "#fff",
		},
	});
};
