import { readFile, writeFile } from "node:fs/promises";

import { logger } from "./logger";

export async function updatePackageJsonFile({
  packageJsonPath,
  scripts = {},
  fields = {}
}: {
  packageJsonPath: string;
  scripts?: Record<string, string>;
  fields?: Record<string, unknown>;
}) {
  try {
    const data = await readFile(packageJsonPath, "utf-8");
    let packageJson = JSON.parse(data);

    packageJson = { ...packageJson, ...fields };
    packageJson.scripts = { ...packageJson.scripts, ...scripts };

    const updatedPackageJson = JSON.stringify(packageJson, null, 2);

    await writeFile(packageJsonPath, updatedPackageJson, "utf8");
  } catch {
    //TODO: Handle error
    logger.error("No package.json found.");
    process.exit(1);
  }
}
