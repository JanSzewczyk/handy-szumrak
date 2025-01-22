import { italic } from "picocolors";
import { type Choice } from "prompts";

import { PrettierConfig } from "../types";

export const PrettierFilePath = {
  [PrettierConfig.ESM]: "prettier.config.mjs",
  [PrettierConfig.CJS]: "prettier.config.cjs",
  [PrettierConfig.PRETTIERRC]: ".prettierrc",
  IGNORE: ".prettierignore"
} as const;
export type PrettierFilePathKeys = keyof typeof PrettierFilePath;

export const PrettierPackages = [
  { name: "prettier", version: "latest" },
  { name: "@szum-tech/prettier-config", version: "latest" }
];

export const PrettierPackageJsonField = {
  prettier: "@szum-tech/prettier-config"
} as const;

export const PrettierScripts = {
  "prettier:check": "prettier --check .",
  "prettier:write": "prettier --write ."
} as const;
export type PrettierScriptsKeys = keyof typeof PrettierScripts;

export const PrettierConfigurationChoices: Array<Choice> = [
  {
    title: "ESM",
    description: `Via ${italic("prettier.config.mjs")} file`,
    value: PrettierConfig.ESM,
    selected: true
  },
  {
    title: "CJS",
    description: `Via ${italic("prettier.config.cjs")} file`,
    value: PrettierConfig.CJS
  },
  {
    title: italic("package.json"),
    description: `Via ${italic("prettier")} key in the project's ${italic("package.json")} file`,
    value: PrettierConfig.PACKAGEJSON
  },
  {
    title: italic(".prettierrc"),
    description: `Via ${italic(".prettierrc")} file`,
    value: PrettierConfig.PRETTIERRC
  }
];

export const PrettierScriptsChoices: Array<Choice> = Object.keys(PrettierScripts).map((script) => ({
  value: script,
  title: italic(script),
  description: PrettierScripts[script as PrettierScriptsKeys],
  selected: true
}));
