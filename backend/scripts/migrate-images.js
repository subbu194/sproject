#!/usr/bin/env node
/**
 * Production-oriented image migration (R2 → optimized WebP + blur).
 *
 * Order of work:
 *   1. LogEntry      — one document at a time; each image slot processed sequentially.
 *   2. Thought       — same.
 *   3. PressItem     — same.
 *   4. Achievement   — same (gallery `images[]` only; `icon` emoji/URL is untouched).
 *
 * For each document: download → Sharp → upload to optimized/{projectId}/main.webp + blur.webp
 * → replace URL in memory → single MongoDB update per document. Original R2 objects are NOT deleted.
 *
 * Does NOT skip a whole document just because `isOptimized` is true; every `images[]` URL is checked.
 * Skips a slot only if it is not your R2 public URL, or already ends with /optimized/.../main.webp.
 *
 * Prerequisites: `npm run build` in backend (uses dist/).
 *
 * Usage (from backend/):
 *   npm run migrate-images
 *   node scripts/migrate-images.js
 *
 * Optional env:
 *   DRY_RUN=1           — log actions only; no R2 upload, no DB writes.
 *   DOWNLOAD_RETRIES=3  — retries per image download (default 3).
 */
'use strict';

const path = require('path');
const crypto = require('crypto');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');

const DRY_RUN = process.env.DRY_RUN === '1' || process.env.DRY_RUN === 'true';
const DOWNLOAD_RETRIES = Math.max(1, parseInt(process.env.DOWNLOAD_RETRIES || '3', 10) || 3);
const RETRY_DELAY_MS = parseInt(process.env.RETRY_DELAY_MS || '1500', 10) || 1500;

const R2_PUBLIC_BASE = (process.env.R2_PUBLIC_BASE_URL || '').replace(/\/$/, '');

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function loadCompiled(rel) {
  const full = path.join(__dirname, '..', 'dist', rel);
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require(full);
  } catch (e) {
    console.error('Missing compiled file:', full);
    console.error('Run `npm run build` in the backend directory first.');
    process.exit(1);
  }
}

function loadModel(name) {
  const m = loadCompiled(`models/${name}.js`);
  return m.default || m;
}

const {
  processImageBuffers,
  uploadOptimizedPairToR2,
  isAlreadyOptimizedPublicUrl,
} = loadCompiled('utils/imageService.js');
const { initializeR2 } = loadCompiled('config/r2.js');

function isR2AssetUrl(url) {
  return !!(R2_PUBLIC_BASE && typeof url === 'string' && url.startsWith(R2_PUBLIC_BASE));
}

function alignBlurs(blurs, len) {
  const b = Array.isArray(blurs) ? [...blurs] : [];
  while (b.length < len) b.push('');
  b.length = len;
  return b;
}

function needsMigration(url) {
  if (!url || typeof url !== 'string') return false;
  return isR2AssetUrl(url) && !isAlreadyOptimizedPublicUrl(url);
}

async function downloadBufferWithRetry(url) {
  let lastErr;
  for (let attempt = 1; attempt <= DOWNLOAD_RETRIES; attempt++) {
    try {
      const res = await fetch(url, { redirect: 'follow' });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
      const arr = await res.arrayBuffer();
      const buf = Buffer.from(arr);
      if (!buf.length) {
        throw new Error('Empty response body');
      }
      return buf;
    } catch (err) {
      lastErr = err;
      const msg = err instanceof Error ? err.message : String(err);
      if (attempt < DOWNLOAD_RETRIES) {
        console.warn(`    … download attempt ${attempt}/${DOWNLOAD_RETRIES} failed (${msg}), retry in ${RETRY_DELAY_MS}ms`);
        await sleep(RETRY_DELAY_MS);
      }
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

/**
 * Migrate one document: all image slots that need work, strictly one image after another.
 * Writes exactly one update to MongoDB for this document (or none if nothing to do / dry-run).
 */
async function migrateOneDocument(Model, doc) {
  const label = Model.modelName;
  const id = String(doc._id);
  const images = [...(doc.images || [])];

  if (images.length === 0) {
    return { status: 'skipped', reason: 'no images' };
  }

  let blurs = alignBlurs(doc.imageBlurUrls, images.length);
  const indicesToMigrate = [];
  for (let i = 0; i < images.length; i++) {
    if (needsMigration(images[i])) {
      indicesToMigrate.push(i);
    }
  }

  if (indicesToMigrate.length === 0) {
    const hasR2 = images.some((u) => isR2AssetUrl(u));
    const allR2AreOpt = images.every((u) => !isR2AssetUrl(u) || isAlreadyOptimizedPublicUrl(u));
    if (hasR2 && allR2AreOpt && !doc.isOptimized && !DRY_RUN) {
      await Model.updateOne({ _id: doc._id }, { $set: { isOptimized: true } });
      console.log(`  [${label}] ${id} — all R2 images already optimized; set isOptimized=true`);
    } else {
      console.log(`  [${label}] ${id} — skip (nothing to migrate)`);
    }
    return { status: 'skipped', reason: 'already migrated or external URLs' };
  }

  console.log(`\n▶ [${label}] ${id} — migrating ${indicesToMigrate.length} image(s) (${images.length} slot(s) total), sequential`);

  const failures = [];

  for (const i of indicesToMigrate) {
    const originalUrl = images[i];
    const n = indicesToMigrate.indexOf(i) + 1;
    const total = indicesToMigrate.length;
    console.log(`    · slot ${i + 1}/${images.length} (task ${n}/${total})`);

    try {
      if (DRY_RUN) {
        console.log(`      DRY_RUN: would download, process, upload; replace:\n      ${originalUrl}`);
        continue;
      }

      const buf = await downloadBufferWithRetry(originalUrl);
      const { main, blur } = await processImageBuffers(buf);
      const projectId = `${id}_${i}_${crypto.randomBytes(4).toString('hex')}`;
      const { publicUrl, blurUrl } = await uploadOptimizedPairToR2(projectId, main, blur);

      images[i] = publicUrl;
      blurs[i] = blurUrl;
      console.log(`      ✓ replaced with ${publicUrl}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`      ✗ FAILED: ${msg}`);
      failures.push({ label, id, slot: i, url: originalUrl, error: msg });
    }
  }

  if (DRY_RUN) {
    return { status: 'dry_run', failures: [] };
  }

  const allMainOpt = images.every(
    (u) => !u || !isR2AssetUrl(u) || isAlreadyOptimizedPublicUrl(u)
  );
  const isOptimized = failures.length === 0 && allMainOpt;

  await Model.updateOne(
    { _id: doc._id },
    { $set: { images, imageBlurUrls: blurs, isOptimized } }
  );

  if (failures.length > 0) {
    console.log(`  [${label}] ${id} — saved partial update; isOptimized=${isOptimized} (false until all slots succeed)`);
    return { status: 'partial', failures };
  }

  console.log(`  [${label}] ${id} — ✓ document saved; isOptimized=${isOptimized}`);
  return { status: 'ok', failures: [] };
}

async function runCollection(Model) {
  const label = Model.modelName;
  console.log(`\n${'='.repeat(72)}\nCollection: ${label}\n${'='.repeat(72)}`);

  const query = {
    images: { $exists: true, $type: 'array', $not: { $size: 0 } },
  };

  const total = await Model.countDocuments(query);
  console.log(`Documents with at least one image: ${total}`);

  let done = 0;
  const cursor = Model.find(query).sort({ _id: 1 }).cursor();

  const allFailures = [];

  // Strictly one document at a time (cursor + await).
  // eslint-disable-next-line no-await-in-loop
  for await (const doc of cursor) {
    done += 1;
    console.log(`\n--- ${label} ${done}/${total} ---`);
    // eslint-disable-next-line no-await-in-loop
    const result = await migrateOneDocument(Model, doc);
    if (result.failures && result.failures.length) {
      allFailures.push(...result.failures);
    }
  }

  return allFailures;
}

async function main() {
  console.log('Image migration (sequential: one document → all its images one-by-one)');
  if (DRY_RUN) {
    console.log('*** DRY_RUN=1 — no uploads and no database writes ***\n');
  }

  const uri = process.env.DB_URL;
  if (!uri) {
    console.error('DB_URL is not set');
    process.exit(1);
  }

  if (!R2_PUBLIC_BASE && !DRY_RUN) {
    console.error('R2_PUBLIC_BASE_URL is required (used to detect which URLs are your R2 assets).');
    process.exit(1);
  }

  const r2 = await initializeR2();
  if (!r2 && !DRY_RUN) {
    console.error('R2 is not configured (R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY).');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB\n');

  const LogEntry = loadModel('LogEntry');
  const Thought = loadModel('Thought');
  const PressItem = loadModel('PressItem');
  const Achievement = loadModel('Achievement');

  /** Fixed order: logs → thoughts → press → achievements (as requested). */
  const models = [LogEntry, Thought, PressItem, Achievement];

  const failures = [];
  for (const Model of models) {
    // eslint-disable-next-line no-await-in-loop
    const f = await runCollection(Model);
    failures.push(...f);
  }

  console.log(`\n${'='.repeat(72)}`);
  console.log('MIGRATION FINISHED');
  console.log(`${'='.repeat(72)}`);
  console.log(`Per-image failures: ${failures.length}`);
  if (failures.length > 0) {
    console.log('\nReview and fix (network, corrupt file, SVG, etc.), then re-run the script.');
    console.log('Already-optimized URLs are skipped; failed slots keep their old URL until a later run succeeds.\n');
    console.log(JSON.stringify(failures, null, 2));
    process.exitCode = 1;
  } else {
    console.log('No per-image failures reported.');
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
  });
