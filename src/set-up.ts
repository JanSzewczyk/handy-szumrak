import { existsSync } from "node:fs";
import path, { resolve, dirname, join } from "node:path";

import { bold } from "picocolors";

import { setESlint } from "./features/eslint";
import { setPrettier } from "./features/prettier";
import { setSemanticRelease } from "./features/semantic-release";
import { type PackageManager } from "./helpers/get-pkg-manager";
import { isOnline } from "./helpers/is-online";
import { isWriteable } from "./helpers/is-writeable";
import { logger } from "./helpers/logger";
import { type Options } from "./types";

export async function setUp({ packageManager, opts }: { packageManager: PackageManager; opts: Options }) {
  logger.log(bold(`Using ${packageManager}.`));

  const templatePath = path.join(__dirname, "templates");
  const root = resolve();

  const useYarn = packageManager === "yarn";
  const online = !useYarn || (await isOnline());
  const originalDirectory = process.cwd();

  if (!(await isWriteable(dirname(root)))) {
    logger.error("The application path is not writable, please check folder permissions and try again.");
    logger.error("It is likely you do not have write permissions for this folder.");
    process.exit(1);
  }

  const packageJsonPath = join(root, "package.json");
  const hasPackageJson = existsSync(packageJsonPath);
  if (!hasPackageJson) {
    logger.error("No package.json found.");
    logger.error("please make sure it is in the main project folder.");
    process.exit(1);
  }

  if (opts.prettier) {
    logger.log(`Setting up ${bold("Prettier")}...`);
    const result = await setPrettier(opts, { templatePath, root, packageJsonPath, packageManager, online });

    if (result) {
      logger.log(`  Prettier configured correctly 🎉🎉🎉`);
    }

    logger.log();
  }

  if (opts.eslint) {
    logger.log(`Setting up ${bold("ESlint")}...`);
    const result = await setESlint(opts, { templatePath, root, packageJsonPath, packageManager, online });

    if (result) {
      logger.log(`  ESlint configured correctly 🎉🎉🎉`);
    }

    logger.log();
  }

  if (opts.semanticRelease) {
    logger.log(`Setting up ${bold("Semantic Release")}...`);
    const result = await setSemanticRelease(opts, { templatePath, root, packageJsonPath, packageManager, online });

    if (result) {
      logger.log(`  Semantic Release configured correctly 🎉🎉🎉`);
    }

    logger.log();
  }
}
