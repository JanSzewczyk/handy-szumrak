import { italic } from "picocolors";
import { type Choice } from "prompts";

import { SemanticReleaseConfig, SemanticReleaseConfigType } from "../types";

export const SemanticReleaseFilePath = {
  [SemanticReleaseConfig.ESM]: {
    FILENAME: "release.config.mjs",
    [SemanticReleaseConfigType.DEFAULT]: "default/release.config.mjs",
    [SemanticReleaseConfigType.NPM]: "npm/release.config.mjs"
  },
  [SemanticReleaseConfig.CJS]: {
    FILENAME: "release.config.cjs",
    [SemanticReleaseConfigType.DEFAULT]: "default/release.config.cjs",
    [SemanticReleaseConfigType.NPM]: "npm/release.config.cjs"
  },
  [SemanticReleaseConfig.PRETTIERRC]: {
    FILENAME: ".releaserc",
    [SemanticReleaseConfigType.DEFAULT]: "default/.releaserc",
    [SemanticReleaseConfigType.NPM]: "npm/.releaserc"
  }
} as const;

export const SemanticReleasePackages = [
  { name: "semantic-release", version: "latest" },
  { name: "@szum-tech/semantic-release-config", version: "latest" }
];

export const SemanticReleaseConfigurationChoices: Array<Choice> = [
  {
    title: "ESM",
    description: `Via ${italic("release.config.mjs")} file`,
    value: SemanticReleaseConfig.ESM,
    selected: true
  },
  {
    title: "CJS",
    description: `Via ${italic("release.config.cjs")} file`,
    value: SemanticReleaseConfig.CJS
  },
  {
    title: italic("package.json"),
    description: `Via ${italic("release")} key in the project's ${italic("package.json")} file`,
    value: SemanticReleaseConfig.PACKAGEJSON
  },
  {
    title: italic(".releaserc"),
    description: `Via ${italic(".releaserc")} file`,
    value: SemanticReleaseConfig.PRETTIERRC
  }
];

export const SemanticReleasePackageJsonField = {
  [SemanticReleaseConfigType.DEFAULT]: {
    release: {
      extends: "@szum-tech/semantic-release-config/without-npm"
    }
  },
  [SemanticReleaseConfigType.NPM]: {
    release: {
      extends: "@szum-tech/semantic-release-config/with-npm"
    }
  }
} as const;
