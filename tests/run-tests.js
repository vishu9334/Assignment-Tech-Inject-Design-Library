import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("==================================================");
console.log("🚀 Running Tech Inject Automated Security Tests (ESM)");
console.log("==================================================\n");

const testFile = path.join(__dirname, "security-and-access.test.js");
const result = spawnSync("npx", ["tsx", "--test", `"${testFile}"`], {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    DATABASE_URL:
      process.env.DATABASE_URL ||
      "postgresql://inject_design_component_user:ZqhrsDDiielQ89YU5iMXUea6kq61AQaw@dpg-dapu8es9v7es739urv1g-a.singapore-postgres.render.com/inject_design_component?sslmode=require",
  },
});

if (result.status !== 0) {
  console.error("\n❌ Tests failed!");
  process.exit(result.status || 1);
} else {
  console.log("\n✅ All automated security and access control tests PASSED!");
}
