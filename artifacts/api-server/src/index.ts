import fs from "fs";
import path from "path";

// Dynamically load environment variables from local .env file if it exists (searching parent folders)
try {
  let currentDir = process.cwd();
  let envPath = path.resolve(currentDir, ".env");
  
  // Walk up the folder tree to find .env (handles monorepo roots)
  for (let i = 0; i < 5; i++) {
    if (fs.existsSync(envPath)) break;
    const parent = path.dirname(currentDir);
    if (parent === currentDir) break;
    currentDir = parent;
    envPath = path.resolve(currentDir, ".env");
  }

  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const firstEquals = trimmed.indexOf("=");
      if (firstEquals !== -1) {
        const key = trimmed.substring(0, firstEquals).trim();
        const val = trimmed.substring(firstEquals + 1).trim().replace(/^['"]|['"]$/g, '');
        if (key) {
          process.env[key] = val;
        }
      }
    }
  }
} catch (e) {
  // Silent fail if .env is missing or unreadable
}

import app from "./app";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
