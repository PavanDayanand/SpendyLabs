import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const source = new URL("../src/data/privacy-policy.json", import.meta.url);
const destination = process.argv[2];
if (!destination) {
  throw new Error("Pass the native privacy-policy.json destination path.");
}
const policy = await readFile(source, "utf8");
JSON.parse(policy);
await writeFile(destination, policy);
console.log(`Synced privacy policy from ${fileURLToPath(source)} to ${destination}`);
