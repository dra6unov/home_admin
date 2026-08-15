import { toast } from "sonner";

export const showSuccessToast = (message: string) => {
	toast.success(message, {
		style: {
			background: "#22c55e",
			color: "#fff",
		},
	});
};

export const showErrorToast = (message: string) => {
	toast.error(message, {
		style: {
			background: "#ef4444",
			color: "#fff",
		},
	});
};
