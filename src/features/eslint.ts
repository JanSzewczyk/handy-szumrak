import { copyFileSync } from "node:fs";
import { join } from "node:path";

import { green, italic } from "picocolors";

import { ESlintFilePath, ESlintPackages, ESlintScripts } from "../constants/eslint";
import { type PackageManager } from "../helpers/get-pkg-manager";
import { install } from "../helpers/install";
import { logger } from "../helpers/logger";
import { updatePackageJsonFile } from "../helpers/package-json";
import { type EslintOptions } from "../types";

export async function setESlint(
  { eslintConfig, eslintScripts }: EslintOptions,
  {
    templatePath,
    root,
    packageJsonPath,
    packageManager,
    online
  }: { templatePath: string; root: string; packageJsonPath: string; online: boolean; packageManager: PackageManager }
) {
  let result = true;

  if (eslintConfig) {
    try {
      copyFileSync(
        join(templatePath, "eslint", ESlintFilePath[eslintConfig]),
        join(root, ESlintFilePath[eslintConfig])
      );
      logger.log(`${green("✔")} Configuration set up successfully.`);
    } catch {
      logger.error("❗ Error while setting up ESlint.");
      return false;
    }
  }

  if (eslintScripts && eslintScripts.length) {
    const scripts = eslintScripts.reduce((acc, script) => {
      return { ...acc, [script]: ESlintScripts[script] };
    }, {});

    await updatePackageJsonFile({
      packageJsonPath,
      scripts
    });
    logger.log(`${green("✔")} Recommended scripts added successfully.`);
  }

  try {
    logger.log(
      `  Adding packages to ${italic("devDependencies")}: ${ESlintPackages.map(({ name }) => italic(name)).join(", ")}\n  Installing packages... This may take some time`
    );
    await install({
      packageManager,
      isOnline: online,
      packages: ESlintPackages.map(({ name, version }) => `${name}@${version}`),
      isDevDependencies: true
    });
    logger.log(`${green("✔")} Packages installed.`);
  } catch {
    logger.error("❗ Error while installing packages.");
    result = false;
  }

  return result;
}
