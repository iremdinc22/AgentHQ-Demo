import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

async function walk(dir) {
  const files = await readdir(dir, { withFileTypes: true });
  for (const file of files) {
    const path = join(dir, file.name);
    assert(!file.isSymbolicLink(), `Unexpected symlink: ${path}`);
    assert(!/^(backend|alembic|\.git|\.env|\.vercel)$|\.(?:log|db|sqlite3?|pem|key)$/i.test(file.name), `Unexpected private artifact: ${path}`);
    if (file.isDirectory()) await walk(path);
    if (file.isFile() && /\.(?:js|ts|tsx|html|css|map)$/i.test(path)) {
      const body = await readFile(path, "utf8");
      assert(!/\/api\/v1(?:\/|["'])|\bEventSource\b|https?:\/\/(?:127\.0\.0\.1|localhost)|\/Users\/|\/private\/tmp\/|\/workspaces\/access|\/model-config\b|-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(body),
        `Unexpected private or API reference: ${path}`);
    }
  }
}

for (const target of ["src", "public", "dist"]) await walk(target);
const html = await readFile("dist/index.html", "utf8");
assert(html.replaceAll("&#39;", "'").includes("connect-src 'none'"), "Production HTML must deny outbound browser connections");
console.log("Source and production output contain no private connection markers. Production CSP denies connections.");
