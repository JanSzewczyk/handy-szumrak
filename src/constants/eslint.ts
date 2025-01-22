import { italic } from "picocolors";
import { type Choice } from "prompts";

import { ESlintConfig } from "../types";

export const ESlintFilePath = {
  [ESlintConfig.ESM]: "eslint.config.mjs",
  [ESlintConfig.CJS]: "eslint.config.cjs"
} as const;
export type ESlintFilePathKeys = keyof typeof ESlintFilePath;

export const ESlintPackages = [
  { name: "eslint", version: "latest" },
  { name: "@szum-tech/eslint-config", version: "latest" }
];

export const ESlintConfigurationChoices: Array<Choice> = [
  {
    title: "ESM",
    description: `Via ${italic("prettier.config.mjs")} file`,
    value: ESlintConfig.ESM,
    selected: true
  },
  {
    title: "CJS",
    description: `Via ${italic("prettier.config.cjs")} file`,
    value: ESlintConfig.CJS
  }
];

export const ESlintScripts = {
  lint: "eslint .",
  "lint:ci": "eslint . -o eslint-results.sarif -f @microsoft/eslint-formatter-sarif",
  "lint:fix": "eslint . --fix",
  "lint:inspect": "npx @eslint/config-inspector@latest"
};
export type ESlintScriptsKeys = keyof typeof ESlintScripts;

export const ESlintScriptsChoices: Array<Choice> = Object.keys(ESlintScripts).map((script) => ({
  value: script,
  title: italic(script),
  description: ESlintScripts[script as ESlintScriptsKeys],
  selected: true
}));
