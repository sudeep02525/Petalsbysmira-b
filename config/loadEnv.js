import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const envLocalPath = path.join(rootDir, ".env.local");
const envPath = path.join(rootDir, ".env");
const envProdPath = path.join(rootDir, ".env.production");

// 1. Prioritize .env.local if present (local dev overrides)
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
}

// 2. Load .env (standard deployment file; will not overwrite existing keys)
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// 3. Load .env.production if present (will not overwrite existing keys)
if (fs.existsSync(envProdPath)) {
  dotenv.config({ path: envProdPath });
}

// 4. Default fallback
dotenv.config();

