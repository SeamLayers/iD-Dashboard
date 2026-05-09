import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Form dialog state syncing & localStorage hydration are valid useEffect patterns.
      "react-hooks/set-state-in-effect": "off",
      // We render arbitrary remote logo URLs which next/image cannot easily handle without configuration.
      "@next/next/no-img-element": "off",
    },
  },
]);

export default eslintConfig;
