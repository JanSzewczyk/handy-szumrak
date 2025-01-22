import { type ESlintScriptsKeys } from "./constants/eslint";
import { type PrettierScriptsKeys } from "./constants/prettier";

export type PrettierOptions = {
  prettier: boolean;
  prettierConfig?: PrettierConfig;
  prettierIgnore?: boolean;
  prettierScripts?: Array<PrettierScriptsKeys>;
};
export type EslintOptions = {
  eslint: boolean;
  eslintConfig?: ESlintConfig;
  eslintScripts?: Array<ESlintScriptsKeys>;
};
export type SemanticReleaseOptions = {
  semanticRelease: boolean;
  semanticReleaseNpm?: boolean;
  semanticReleaseConfig?: SemanticReleaseConfig;
};

export type Options = PrettierOptions & EslintOptions & SemanticReleaseOptions;

export const PrettierConfig = {
  ESM: "ESM",
  CJS: "CJS",
  PACKAGEJSON: "PACKAGEJSON",
  PRETTIERRC: "PRETTIERRC"
} as const;
export type PrettierConfig = (typeof PrettierConfig)[keyof typeof PrettierConfig];

export const ESlintConfig = {
  ESM: "ESM",
  CJS: "CJS"
} as const;
export type ESlintConfig = (typeof ESlintConfig)[keyof typeof ESlintConfig];

export const SemanticReleaseConfig = {
  ESM: "ESM",
  CJS: "CJS",
  PACKAGEJSON: "PACKAGEJSON",
  PRETTIERRC: "PRETTIERRC"
} as const;
export type SemanticReleaseConfig = (typeof SemanticReleaseConfig)[keyof typeof SemanticReleaseConfig];

export const SemanticReleaseConfigType = {
  DEFAULT: "DEFAULT",
  NPM: "NPM"
} as const;
export type SemanticReleaseConfigType = (typeof SemanticReleaseConfigType)[keyof typeof SemanticReleaseConfigType];
