import spawn from "cross-spawn";

import { type PackageManager } from "./get-pkg-manager";

export async function run({
  packageManager,
  script
}: {
  packageManager: PackageManager;
  script: string;
}): Promise<void> {
  const args: string[] = ["run", script];

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
