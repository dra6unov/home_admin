import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,
	// Override default ignores of eslint-config-next.
	globalIgnores([
		// Default ignores of eslint-config-next:
		".next/**",
		"out/**",
		"build/**",
		"next-env.d.ts",
	]),
	{
		rules: {
			"indent": ["error", "tab"],
			"@typescript-eslint/indent": "off",
			"no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
			"padding-line-between-statements": [
				"error",
				{ blankLine: "always", prev: "*", next: "return" },
			],
		},
	},
]);

export default eslintConfig;
