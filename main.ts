// Hong Kong in Numbers — the hand-in program.
//
// Copies app/ and screenshots/ from this repository into the output
// directory and writes /output/dossier.json with buildDossier from
// vendor/makefun-frontend.ts. Outside the grader, MAKEFUN_OUTPUT_DIR
// stands in for /output. Node 22, standard library only; no network.

import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Start from an empty output directory so a second run writes exactly the
// same bytes as the first.
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

for (const name of ["app", "screenshots"]) {
  cpSync(join(repoRoot, name), join(outDir, name), { recursive: true });
}

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});

if (dossier.length > 1572864) {
  throw new Error(`dossier.json is ${dossier.length} bytes, over the 1.5 MiB gate cap`);
}

writeFileSync(join(outDir, "dossier.json"), dossier);
console.log(`wrote ${join(outDir, "dossier.json")} (${dossier.length} bytes)`);
