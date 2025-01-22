import spawn from "cross-spawn";
import { yellow } from "picocolors";

import { type PackageManager } from "./get-pkg-manager";
import { logger } from "./logger";

function getAddPackagesFlag(packageManager: PackageManager, isDevDependencies: boolean): Array<string> {
  switch (packageManager) {
    case "npm":
      return isDevDependencies ? ["install", "--save-dev"] : ["install"];
    case "yarn":
      return isDevDependencies ? ["add", "-D"] : ["add"];
    case "pnpm":
      return isDevDependencies ? ["add", "--save-dev"] : ["install"];
    case "bun":
      return isDevDependencies ? ["add", "--dev"] : ["add"];
    default:
      return isDevDependencies ? ["install", "-D"] : ["install"];
  }
}

export async function install({
  isOnline,
  packages = [],
  isDevDependencies = false,
  packageManager
}: {
  packageManager: PackageManager;
  packages?: Array<string>;
  isDevDependencies?: boolean;
  isOnline: boolean;
}): Promise<void> {
  const args: string[] = packages.length
    ? [...getAddPackagesFlag(packageManager, isDevDependencies), ...packages]
    : ["install"];
  if (!isOnline) {
    logger.log(yellow("You appear to be offline.\nFalling back to the local cache."));
    args.push("--offline");
  }

  return new Promise((resolve, reject) => {
    const child = spawn(packageManager, args, {
      stdio: "ignore",
      env: {
        ...process.env,
        ADBLOCK: "1",
        // we set NODE_ENV to development as pnpm skips dev
        // dependencies when production
        NODE_ENV: "development",
        DISABLE_OPENCOLLECTIVE: "1"
      }
    });
    child.on("close", (code) => {
      if (code !== 0) {
        reject({ command: `${packageManager} ${args.join(" ")}` });
        return;
      }
      resolve();
    });
  });
}
