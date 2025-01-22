import { copyFileSync } from "node:fs";
import { join } from "node:path";

import { green, italic } from "picocolors";

import {
  SemanticReleaseFilePath,
  SemanticReleasePackageJsonField,
  SemanticReleasePackages
} from "../constants/semantic-release";
import { type PackageManager } from "../helpers/get-pkg-manager";
import { install } from "../helpers/install";
import { logger } from "../helpers/logger";
import { updatePackageJsonFile } from "../helpers/package-json";
import { SemanticReleaseConfig, SemanticReleaseConfigType, type SemanticReleaseOptions } from "../types";

export async function setSemanticRelease(
  { semanticReleaseConfig, semanticReleaseNpm }: SemanticReleaseOptions,
  {
    templatePath,
    root,
    packageJsonPath,
    packageManager,
    online
  }: { templatePath: string; root: string; packageJsonPath: string; online: boolean; packageManager: PackageManager }
) {
  const semanticReleaseConfigType = semanticReleaseNpm
    ? SemanticReleaseConfigType.NPM
    : SemanticReleaseConfigType.DEFAULT;

  if (semanticReleaseConfig) {
    try {
      if (semanticReleaseConfig === SemanticReleaseConfig.PACKAGEJSON) {
        await updatePackageJsonFile({
          packageJsonPath,
          fields: SemanticReleasePackageJsonField[semanticReleaseConfigType]
        });
      } else {
        copyFileSync(
          join(
            templatePath,
            "semantic-release",
            SemanticReleaseFilePath[semanticReleaseConfig][semanticReleaseConfigType]
          ),
          join(root, SemanticReleaseFilePath[semanticReleaseConfig].FILENAME)
        );
        logger.log(`${green("✔")} Configuration set up successfully.`);
      }
    } catch {
      logger.error("❗ Error while setting up Semantic Release.");
      return false;
    }
  }

  try {
    logger.log(
      `  Adding packages to ${italic("devDependencies")}: ${SemanticReleasePackages.map(({ name }) => italic(name)).join(", ")}\n  Installing packages... This may take some time`
    );
    await install({
      packageManager,
      isOnline: online,
      packages: SemanticReleasePackages.map(({ name, version }) => `${name}@${version}`),
      isDevDependencies: true
    });
    logger.log(`${green("✔")} Packages installed.`);
  } catch {
    logger.error("❗ Error while installing packages.");
    return false;
  }

  return true;
}
