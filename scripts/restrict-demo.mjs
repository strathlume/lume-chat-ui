// Writes the demo site's allow list into the Static Web Apps config at build time.
// The ranges live in the DEMO_ALLOWED_IPS secret (comma separated), never in the repo.
import { readFileSync, writeFileSync } from "node:fs";

const file = process.argv[2] ?? "dist/staticwebapp.config.json";
const ranges = (process.env.DEMO_ALLOWED_IPS ?? "")
  .split(",")
  .map((range) => range.trim())
  .filter(Boolean);

if (ranges.length === 0) {
  console.error("DEMO_ALLOWED_IPS is empty: refusing to publish an open demo");
  process.exit(1);
}

const config = JSON.parse(readFileSync(file, "utf8"));
config.networking = { allowedIpRanges: ranges };
writeFileSync(file, JSON.stringify(config, null, 2) + "\n");
console.log(`demo restricted to ${ranges.length} range(s)`);
