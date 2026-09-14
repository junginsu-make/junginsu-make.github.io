import sharp from "sharp";
import { readdir } from "fs/promises";
import { join, extname, basename, dirname } from "path";

const PUBLIC_DIRS = [
  "public/photos",
  "public/photos/teaching",
  "public/saas-folders/mcs",
  "public/saas-folders/tickpoint",
  "public/saas-folders/lumio",
  "public/saas-folders/os-agent",
  "public/saas-folders/mkt-automation",
  "public/saas-folders/propintel",
  "public/saas-folders/architect",
  "public/saas-folders/factto",
  "public/saas-folders/shopping-insight",
  "public/saas-folders/place-insight",
  "public/automation",
  "public/captured",
];

async function* walk(dir: string): AsyncGenerator<string> {
  try {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) yield* walk(path);
      else yield path;
    }
  } catch {
    return;
  }
}

async function optimize(file: string) {
  const rawExt = extname(file);
  const ext = rawExt.toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) return;
  // skip if already a generated variant
  if (file.endsWith(".webp") || file.endsWith(".avif")) return;
  const dir = dirname(file);
  // strip the actual (case-preserved) extension so JPG/PNG don't leak into the name
  const name = basename(file, rawExt);
  const webpOut = join(dir, `${name}.webp`);
  const avifOut = join(dir, `${name}.avif`);
  try {
    await sharp(file)
      .resize({ width: 2000, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(webpOut);
    await sharp(file)
      .resize({ width: 2000, withoutEnlargement: true })
      .avif({ quality: 65 })
      .toFile(avifOut);
    console.log(`OK ${file}`);
  } catch (e) {
    console.error(`FAIL ${file}: ${e}`);
  }
}

(async () => {
  const start = Date.now();
  let count = 0;
  for (const root of PUBLIC_DIRS) {
    for await (const file of walk(root)) {
      await optimize(file);
      count++;
    }
  }
  console.log(`Done. ${count} files processed in ${(Date.now() - start) / 1000}s`);
})();
