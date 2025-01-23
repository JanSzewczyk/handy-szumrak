#!/usr/bin/env node

import { Command } from "commander";
import { bold, cyan, yellow, italic } from "picocolors";
import updateCheck from "update-check";

import packageJson from "../package.json";

import { ESlintConfigurationChoices, ESlintScriptsChoices } from "./constants/eslint";
import { PrettierConfigurationChoices, PrettierScriptsChoices } from "./constants/prettier";
import { SemanticReleaseConfigurationChoices } from "./constants/semantic-release";
import { getPkgManager, type PackageManager } from "./helpers/get-pkg-manager";
import { logger } from "./helpers/logger";
import { prompt } from "./helpers/prompt";
import { setUp } from "./set-up";
import { type Options } from "./types";
import { sleep } from "./utils";

function handleSigTerm() {
  return process.exit(0);
}

process.on("SIGINT", handleSigTerm);
process.on("SIGTERM", handleSigTerm);

const program = new Command(packageJson.name)
  .version(packageJson.version, "-v, --version", "Output the current version of handy-szumrak.")
  .helpOption("-h, --help", "Display this help message.")
  .allowUnknownOption()
  .parse(process.argv);

let opts: Options = { prettier: false, eslint: false, semanticRelease: false };

const packageManager: PackageManager = getPkgManager();

async function run(): Promise<void> {
  const { prettier } = await prompt({
    type: "toggle",
    name: "prettier",
    message: `Would you like to use ${bold("Prettier")}?`,
    initial: "Yes",
    active: "Yes",
    inactive: "No"
  });
  opts.prettier = prettier;

  if (prettier) {
    const { prettierConfig } = await prompt({
      type: "select",
      name: "prettierConfig",
      message: `  Please select how you want to configure Prettier:`,
      choices: PrettierConfigurationChoices
    });
    opts.prettierConfig = prettierConfig;

    const { prettierIgnore } = await prompt({
      type: "toggle",
      name: "prettierIgnore",
      message: `  Would you like to add ${italic(".prettierignore")} file?`,
      initial: "Yes",
      active: "Yes",
      inactive: "No"
    });
    opts.prettierIgnore = prettierIgnore;

    const { hasPrettierScripts } = await prompt({
      type: "toggle",
      name: "hasPrettierScripts",
      message: `  Would you like to add recommended scripts to ${italic("package.json")} file?`,
      initial: "Yes",
      active: "Yes",
      inactive: "No"
    });

    if (hasPrettierScripts) {
      const { prettierScripts } = await prompt({
        type: "multiselect",
        name: "prettierScripts",
        message: `  Please select the scripts you want to add:`,
        choices: PrettierScriptsChoices
      });
      opts.prettierScripts = prettierScripts;
    }
  }

  //   ESLINT
  const { eslint } = await prompt({
    type: "toggle",
    name: "eslint",
    message: `Would you like to use ${bold("ESlint")}?`,
    initial: "Yes",
    active: "Yes",
    inactive: "No"
  });
  opts.eslint = eslint;

  if (eslint) {
    const { eslintConfig } = await prompt({
      type: "select",
      name: "eslintConfig",
      message: `  Please choose a ESlint configuration:`,
      choices: ESlintConfigurationChoices
    });
    opts.eslintConfig = eslintConfig;

    const { hasEslintScripts } = await prompt({
      type: "toggle",
      name: "hasEslintScripts",
      message: `  Would you like to add recommended scripts to ${italic("package.json")} file?`,
      initial: "Yes",
      active: "Yes",
      inactive: "No"
    });

    if (hasEslintScripts) {
      const { eslintScripts } = await prompt({
        type: "multiselect",
        name: "eslintScripts",
        message: `  Please select the scripts you want to add:`,
        choices: ESlintScriptsChoices
      });
      opts.eslintScripts = eslintScripts;
    }
  }

  //   SEMANTIC RELEASE
  const { semanticRelease } = await prompt({
    type: "toggle",
    name: "semanticRelease",
    message: `Would you like to use ${bold("Semantic Release")}?`,
    initial: "Yes",
    active: "Yes",
    inactive: "No"
  });
  opts.semanticRelease = semanticRelease;

  if (semanticRelease) {
    const { semanticReleaseNpm } = await prompt({
      type: "toggle",
      name: "semanticReleaseNpm",
      message: `  Would you like to release your package to NPM?`,
      initial: "Yes",
      active: "Yes",
      inactive: "No"
    });
    opts.semanticReleaseNpm = semanticReleaseNpm;

    const { semanticReleaseConfig } = await prompt({
      type: "select",
      name: "semanticReleaseConfig",
      message: `  Please choose a Semantic Release configuration:`,
      choices: SemanticReleaseConfigurationChoices
    });
    opts.semanticReleaseConfig = semanticReleaseConfig;
  }

  logger.log();
  await setUp({ packageManager, opts });

  await footer();
}

async function footer() {
  logger.log();
  logger.log(`Dear ${bold("Developer")}`);
  await sleep(2_000);
  logger.log("\nThanks a lot for using 'handy-szumrak'");
  await sleep(2_000);
  logger.log("If I helped you, leave a star ⭐ 👉 https://github.com/JanSzewczyk/handy-szumrak");
  await sleep(2_000);
  logger.log("And recommend to others");
  await sleep(4_000);
  logger.log(`\nMay the ${bold("SZUMRAK")} be with You 🚀🚀🚀`);
}

const update = updateCheck(packageJson).catch(() => null);

async function notifyUpdate(): Promise<void> {
  try {
    if ((await update)?.latest) {
      const global = {
        npm: "npm i -g",
        yarn: "yarn global add",
        pnpm: "pnpm add -g",
        bun: "bun add -g"
      };
      logger.log();
      logger.log(
        yellow(bold("A new version of `handy-szumrak` is available!")) +
          "\n" +
          "You can update by running: " +
          cyan(`${global[packageManager]} handy-szumrak`) +
          "\n"
      );
    }
    process.exit(0);
  } catch {
    // ignore error
  }
}

async function exit(reason: { command?: string }) {
  logger.log();
  logger.log("Aborting installation.");
  if (reason.command) {
    logger.log(`  ${cyan(reason.command)} has failed.`);
  } else {
    logger.log("Unexpected error. Please report it as a bug:" + "\n", reason);
  }
  logger.log();
  await notifyUpdate();
  process.exit(1);
}

run().then(notifyUpdate).catch(exit);
