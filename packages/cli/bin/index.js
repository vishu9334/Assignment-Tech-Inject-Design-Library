#!/usr/bin/env node

/**
 * Tech Inject UI CLI Installer (ES Module)
 * Adds components directly into consumer React/Next.js projects.
 */

import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import https from "node:https";
import process from "node:process";

const args = process.argv.slice(2);

function printHelp() {
  console.log(`
Tech Inject UI Component Installer

Usage:
  npx tech-inject-ui add <component-slug> [options]

Options:
  --token <jwt>       Customer authorization token (required for premium components)
  --target <dir>      Destination folder (default: src/components/ui or components/ui)
  --registry <url>    Custom registry URL (default: env TECH_INJECT_REGISTRY or http://localhost:3000)
  --force             Overwrite existing files without prompting
  --help, -h          Show this help message

Examples:
  npx tech-inject-ui add button
  npx tech-inject-ui add deals-table --token eyJhbGci...
`);
}

if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  printHelp();
  process.exit(0);
}

const command = args[0];
if (command !== "add") {
  console.error(`Unknown command '${command}'. Use 'add <component-slug>'`);
  process.exit(1);
}

const slug = args[1];
if (!slug || slug.startsWith("--")) {
  console.error("Please specify a component slug. Example: npx tech-inject-ui add button");
  process.exit(1);
}

// Parse flags
let token = null;
let targetDir = null;
let registry = process.env.TECH_INJECT_REGISTRY || "http://localhost:3000";
let force = false;

for (let i = 2; i < args.length; i++) {
  if (args[i] === "--token" && args[i + 1]) {
    token = args[++i];
  } else if (args[i] === "--target" && args[i + 1]) {
    targetDir = args[++i];
  } else if (args[i] === "--registry" && args[i + 1]) {
    registry = args[++i];
  } else if (args[i] === "--force") {
    force = true;
  }
}

registry = registry.replace(/\/$/, "");

// 1. Path Safety Verification
function resolveSafeTargetDir(customDir) {
  const cwd = process.cwd();

  let selectedDir;
  if (customDir) {
    selectedDir = path.resolve(cwd, customDir);
  } else if (fs.existsSync(path.join(cwd, "src", "components"))) {
    selectedDir = path.resolve(cwd, "src", "components", "ui");
  } else {
    selectedDir = path.resolve(cwd, "components", "ui");
  }

  // Prevent directory traversal attacks outside consumer root
  const relative = path.relative(cwd, selectedDir);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    console.error("Security Error: Target path cannot be outside current project directory!");
    process.exit(1);
  }

  return selectedDir;
}

const destDir = resolveSafeTargetDir(targetDir);

// 2. Fetch component from registry using native fetch if available or https/http
async function fetchComponent(url, authToken) {
  if (typeof fetch === "function") {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "tech-inject-cli/1.0.0",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
    });
    const body = await res.json();
    return { status: res.status, body };
  }

  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith("https:");
    const client = isHttps ? https : http;

    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (isHttps ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: "GET",
      headers: {
        "User-Agent": "tech-inject-cli/1.0.0",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
    };

    const req = client.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, body: json });
        } catch {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on("error", (e) => reject(e));
    req.end();
  });
}

async function run() {
  console.log(`\n📦 Fetching component '${slug}' from ${registry}...`);

  try {
    const installUrl = `${registry}/api/install/${slug}`;
    const { status, body } = await fetchComponent(installUrl, token);

    if (status === 403) {
      console.error(
        `\n❌ Access Denied: ${body.message || "Component requires an active premium account."}`
      );
      console.error(
        "👉 Provide your token with: npx tech-inject-ui add " +
          slug +
          " --token <YOUR_TOKEN>\n"
      );
      process.exit(1);
    }

    if (status === 404) {
      console.error(`\n❌ Component '${slug}' not found or is currently unpublished.\n`);
      process.exit(1);
    }

    if (status >= 400 || !body.success) {
      console.error(`\n❌ Error (${status}): ${body.message || "Failed to download component"}\n`);
      process.exit(1);
    }

    const comp = body.data;

    if (!comp.code || !comp.filename) {
      console.error("❌ Malformed component payload received from registry.");
      process.exit(1);
    }

    const safeFilename = path.basename(comp.filename);
    const destFilePath = path.join(destDir, safeFilename);

    if (fs.existsSync(destFilePath) && !force) {
      console.warn(`\n⚠️  File already exists: ${path.relative(process.cwd(), destFilePath)}`);
      console.warn("👉 Use --force to overwrite existing files.\n");
      process.exit(1);
    }

    fs.mkdirSync(destDir, { recursive: true });
    fs.writeFileSync(destFilePath, comp.code, "utf8");

    console.log(`\n✅ Installed: ${path.relative(process.cwd(), destFilePath)}`);
    console.log(`   Component: ${comp.name} (v${comp.version || "1.0.0"})`);
    console.log(`   Tier:      ${comp.accessLevel}`);

    if (comp.dependencies && comp.dependencies.length > 0) {
      console.log(`\n📌 Required dependencies: npm install ${comp.dependencies.join(" ")}`);
    }

    console.log("\n🎉 Ready to import in your React / Next.js app:");
    console.log(`   import { ${comp.name} } from "@/components/ui/${comp.name}";\n`);
  } catch (err) {
    console.error(`\n❌ CLI Error: ${err.message}\n`);
    process.exit(1);
  }
}

run();
