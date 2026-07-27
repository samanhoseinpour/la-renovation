#!/usr/bin/env node
// Convert a folder of raster images to visually-lossless AVIF for
// la-renovation's public/images tree (Araz Construction Group site).
//
// Usage:
//   node scripts/migrate-images-to-avif.mjs --src <dir> --out <dir under public/images> \
//        [--quality 80] [--effort 6] [--max-dim 1600] [--aspect W:H] [--no-prefix]
//
// --max-dim downscales the longest edge to fit (never enlarges) before encoding,
// so oversized source captures land at display resolution in a single AVIF pass
// (no second re-encode / generation loss). Omit it to keep native dimensions.
//
// --aspect W:H cover-crops to that ratio (e.g. "3:4" for portraits) before the
// --max-dim resize, centred on whatever the source's most "interesting" region
// is (sharp's attention-based crop). Omit it to keep the source's native ratio.
//
// Output names follow the public/images convention ("path flattened with hyphens"):
//   <out-path-under-public/images, hyphenated>-<source-basename>.avif
// e.g. --out public/images/shared/client-logos  ->  shared-client-logos-<name>.avif
// Pass --no-prefix to drop that prefix entirely (e.g. a folder that's already
// named for its contents, like public/images/team, where files should read
// as plain <person-name>.avif rather than team-<person-name>.avif).
//
// Reuses the sharp that ships with Next (no extra dependency); reads png/jpg/jpeg/webp.

import sharp from 'sharp';
import { readdir, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    args[key] = next && !next.startsWith('--') ? argv[++i] : 'true';
  }
  return args;
}

// Flatten the destination path under public/images into a hyphenated filename prefix.
function derivePrefix(outDir) {
  const norm = outDir.split(path.sep).join('/');
  const marker = 'public/images/';
  const idx = norm.indexOf(marker);
  const rel = idx >= 0 ? norm.slice(idx + marker.length) : path.basename(norm);
  return rel.replace(/\/+$/, '').split('/').filter(Boolean).join('-');
}

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const srcDir = args.src && path.resolve(args.src);
  const outDir = args.out && path.resolve(args.out);
  const quality = Number(args.quality ?? 80);
  const effort = Number(args.effort ?? 6);
  const maxDim = args['max-dim'] ? Number(args['max-dim']) : null;
  const aspect = args.aspect?.split(':').map(Number);

  if (!srcDir || !outDir) {
    console.error(
      'Usage: node scripts/migrate-images-to-avif.mjs --src <dir> --out <dir under public/images> [--quality 80] [--effort 6] [--max-dim 1600] [--aspect W:H] [--no-prefix]',
    );
    process.exit(1);
  }
  if (!existsSync(srcDir)) {
    console.error(`Source dir not found: ${srcDir}`);
    process.exit(1);
  }

  const prefix = args['no-prefix'] === 'true' ? '' : derivePrefix(outDir);
  await mkdir(outDir, { recursive: true });

  const entries = await readdir(srcDir, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile() && IMAGE_EXTS.has(path.extname(e.name).toLowerCase()))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b));

  console.log(`\nConverting ${files.length} image(s)`);
  console.log(`  src:    ${srcDir}`);
  console.log(`  out:    ${outDir}`);
  console.log(`  prefix: ${prefix ? `${prefix}-` : '(none)'}`);
  console.log(`  aspect: ${aspect?.length === 2 ? `${aspect[0]}:${aspect[1]} (cover-crop)` : 'native'}`);
  console.log(`  resize: ${maxDim ? `≤${maxDim}px (longest edge, no enlarge)` : 'none (native size)'}`);
  console.log(`  avif:   quality=${quality} effort=${effort} chroma=4:4:4\n`);

  let totalIn = 0;
  let totalOut = 0;
  let ok = 0;
  const grew = [];
  const failed = [];

  for (const name of files) {
    const base = name.slice(0, name.length - path.extname(name).length);
    const srcPath = path.join(srcDir, name);
    const outName = prefix ? `${prefix}-${base}.avif` : `${base}.avif`;
    const outPath = path.join(outDir, outName);
    try {
      const inSize = (await stat(srcPath)).size;
      const pipeline = sharp(srcPath).rotate(); // honour EXIF orientation if present (no-op for flat logos)
      if (aspect?.length === 2 && aspect.every((n) => Number.isFinite(n) && n > 0)) {
        const meta = await sharp(srcPath).rotate().metadata();
        const [aw, ah] = aspect;
        let width = meta.width;
        let height = Math.round((width * ah) / aw);
        if (height > meta.height) {
          height = meta.height;
          width = Math.round((height * aw) / ah);
        }
        if (maxDim && Math.max(width, height) > maxDim) {
          const s = maxDim / Math.max(width, height);
          width = Math.round(width * s);
          height = Math.round(height * s);
        }
        pipeline.resize({ width, height, fit: 'cover', position: 'attention' });
      } else if (maxDim) {
        pipeline.resize({ width: maxDim, height: maxDim, fit: 'inside', withoutEnlargement: true });
      }
      await pipeline
        .avif({ quality, effort, chromaSubsampling: '4:4:4' })
        .toFile(outPath);
      const outSize = (await stat(outPath)).size;
      totalIn += inSize;
      totalOut += outSize;
      ok++;
      const delta = 100 * (1 - outSize / inSize);
      const note = delta >= 0 ? `${delta.toFixed(0)}% smaller` : `${Math.abs(delta).toFixed(0)}% LARGER ⚠`;
      if (outSize > inSize) grew.push(outName);
      console.log(`  ✓ ${name.padEnd(34)} ${kb(inSize).padStart(9)} → ${kb(outSize).padStart(9)}  (${note})  →  ${outName}`);
    } catch (err) {
      failed.push(name);
      console.log(`  ✗ ${name}  FAILED: ${err.message}`);
    }
  }

  console.log(`\nDone: ${ok}/${files.length} converted.`);
  if (totalIn > 0) {
    console.log(`Total: ${kb(totalIn)} → ${kb(totalOut)}  (saved ${(100 * (1 - totalOut / totalIn)).toFixed(1)}%)`);
  }
  if (grew.length) console.log(`Larger than source (${grew.length}): ${grew.join(', ')}`);
  if (failed.length) {
    console.log(`Failed (${failed.length}): ${failed.join(', ')}`);
    process.exitCode = 1;
  }
}

main();
