import { copyFileSync } from "node:fs";
import { join } from "node:path";

import { green, italic } from "picocolors";

import {
  PrettierFilePath,
  type PrettierFilePathKeys,
  PrettierPackageJsonField,
  PrettierPackages,
  PrettierScripts
} from "../constants/prettier";
import { type PackageManager } from "../helpers/get-pkg-manager";
import { install } from "../helpers/install";
import { logger } from "../helpers/logger";
import { updatePackageJsonFile } from "../helpers/package-json";
import { PrettierConfig, type PrettierOptions } from "../types";

export async function setPrettier(
  { prettierIgnore, prettierConfig, prettierScripts }: PrettierOptions,
  {
    templatePath,
    root,
    packageJsonPath,
    packageManager,
    online
  }: { templatePath: string; root: string; packageJsonPath: string; online: boolean; packageManager: PackageManager }
) {
  let result = true;

  try {
    if (prettierConfig === PrettierConfig.PACKAGEJSON) {
      await updatePackageJsonFile({ packageJsonPath, fields: PrettierPackageJsonField });
    } else {
      copyFileSync(
        join(templatePath, "prettier", PrettierFilePath[prettierConfig as PrettierFilePathKeys]),
        join(root, PrettierFilePath[prettierConfig as PrettierFilePathKeys])
      );
    }
    logger.log(`${green("✔")} Configuration set up successfully.`);
  } catch {
    logger.error("❗ Error while setting up Prettier.");
    return false;
  }

  if (prettierIgnore) {
    try {
      copyFileSync(join(templatePath, "prettier", PrettierFilePath.IGNORE), join(root, PrettierFilePath.IGNORE));
      logger.log(`${green("✔")} ${italic(PrettierFilePath.IGNORE)} file added successfully.`);
    } catch {
      logger.error(`❗ Error while adding ${italic(PrettierFilePath.IGNORE)} file.`);
      result = false;
    }
  }

  if (prettierScripts && prettierScripts.length) {
    const scripts = prettierScripts.reduce((acc, script) => {
      return { ...acc, [script]: PrettierScripts[script] };
    }, {});

    await updatePackageJsonFile({
      packageJsonPath,
      scripts
    });

    logger.log(`${green("✔")} Recommended scripts added successfully.`);
  }

  try {
    logger.log(
      `  Adding packages to ${italic("devDependencies")}: ${PrettierPackages.map(({ name }) => italic(name)).join(", ")}\n  Installing packages... This may take some time`
    );

    await install({
      packageManager,
      isOnline: online,
      packages: PrettierPackages.map(({ name, version }) => `${name}@${version}`),
      isDevDependencies: true
    });
    logger.log(`${green("✔")} Packages installed.`);
  } catch {
    logger.error("❗ Error while installing packages.");
    result = false;
  }

  return result;
}
