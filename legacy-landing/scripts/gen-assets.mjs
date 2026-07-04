/**
 * Phase 4 — Visual asset generation.
 *
 * Primary:  Gemini 2.5 Flash Image  (requires a billing-enabled API key).
 * Fallback: Pollinations.ai (FLUX)  — genuinely free, keyless, no quota.
 *
 * Generates art-directed imagery, then emits optimized AVIF + WebP alongside
 * the source PNG. Every asset shares one art-direction block for a cohesive,
 * bespoke aesthetic.
 *
 *   Usage:  npm run gen:assets
 */
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public", "images", "generated");

/** Minimal .env.local loader — this script runs outside the Next runtime. */
function loadEnvLocal() {
  const path = join(ROOT, ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}
loadEnvLocal();

const API_KEY = process.env.GEMINI_API_KEY;

/** Shared art direction — keeps every generated asset visually unified. */
const ART_DIRECTION =
  "Cohesive art direction for a premium brand. Midnight-indigo " +
  "and electric-cyan colour palette. Cinematic volumetric lighting with god " +
  "rays, global illumination, expressive negative space, shallow depth of " +
  "field. Subtle film grain, gentle chromatic aberration and vignetting. " +
  "High-fidelity photorealistic render, crisp anti-aliasing, emotionally " +
  "resonant and hopeful. No text, no logos, no watermark.";

/** Initial assets required for the Hero section. Extend as the overhaul grows. */
const ASSETS = [
  {
    name: "hero-portrait",
    aspectRatio: "4:5",
    prompt:
      "A diverse group of international university students on a sunlit modern " +
      "campus at golden hour, holding books and tablets, candid and quietly " +
      "confident. Glass-and-stone architecture softly out of focus behind " +
      "them. Warm golden key light with cool indigo and electric-cyan rim " +
      "lighting tracing the subjects. Editorial photography.",
  },
];

/** Resolve pixel dimensions for an aspect ratio, longest edge = 1280. */
function dimsFor(aspect) {
  const [aw, ah] = aspect.split(":").map(Number);
  const longest = 1280;
  return aw >= ah
    ? { width: longest, height: Math.round((longest * ah) / aw) }
    : { width: Math.round((longest * aw) / ah), height: longest };
}

/** Attempt Gemini 2.5 Flash Image. Returns a Buffer, or null if unavailable. */
async function viaGemini(asset) {
  if (!API_KEY || API_KEY === "PASTE_YOUR_KEY_HERE") return null;
  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: `${asset.prompt} ${ART_DIRECTION} Aspect ratio ${asset.aspectRatio}.`,
      config: {
        responseModalities: ["IMAGE"],
        imageConfig: { aspectRatio: asset.aspectRatio },
      },
    });
    const parts = res?.candidates?.[0]?.content?.parts ?? [];
    const image = parts.find((p) => p.inlineData?.data);
    if (image) return Buffer.from(image.inlineData.data, "base64");
    console.warn("    · Gemini returned no image part.");
  } catch (err) {
    const msg = String(err?.message ?? err);
    if (msg.includes("limit: 0") || msg.includes("RESOURCE_EXHAUSTED")) {
      console.warn(
        "    · Gemini: image generation is not on the free tier (needs billing). Falling back.",
      );
    } else {
      console.warn(`    · Gemini failed — ${msg.slice(0, 200)}`);
    }
  }
  return null;
}

async function fetchImage(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "hitaishi-assetgen/1.0" },
    signal: AbortSignal.timeout(180000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const type = res.headers.get("content-type") || "";
  const buf = Buffer.from(await res.arrayBuffer());
  if (!type.startsWith("image/") || buf.length < 4096) {
    throw new Error(`unexpected response (${type}, ${buf.length} bytes)`);
  }
  return buf;
}

/** Free, keyless fallback — Pollinations.ai (FLUX). */
async function viaPollinations(asset) {
  const { width, height } = dimsFor(asset.aspectRatio);
  const prompt = `${asset.prompt} ${ART_DIRECTION}`;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    const seed = Math.floor(Math.random() * 1_000_000);
    const url =
      `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` +
      `?width=${width}&height=${height}&model=flux&seed=${seed}&nologo=true`;
    try {
      return await fetchImage(url);
    } catch (err) {
      console.warn(
        `    · Pollinations attempt ${attempt} failed — ${err.message ?? err}`,
      );
      if (attempt < 4) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }
  return null;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  let succeeded = 0;

  for (const asset of ASSETS) {
    console.log(`\n▸ ${asset.name}  (${asset.aspectRatio})`);

    let raw = await viaGemini(asset);
    let source = "Gemini";
    if (!raw) {
      raw = await viaPollinations(asset);
      source = "Pollinations";
    }
    if (!raw) {
      console.error(`  ✗ ${asset.name} — all generators failed.`);
      continue;
    }

    const base = join(OUT_DIR, asset.name);
    const png = await sharp(raw).png().toBuffer();
    writeFileSync(`${base}.png`, png);
    await sharp(png).avif({ quality: 62 }).toFile(`${base}.avif`);
    await sharp(png).webp({ quality: 80 }).toFile(`${base}.webp`);
    console.log(`  ✓ ${asset.name} via ${source} — png · avif · webp`);
    succeeded += 1;
  }

  console.log(
    `\nDone — ${succeeded}/${ASSETS.length} asset(s) in public/images/generated/\n`,
  );
  if (succeeded === 0) process.exit(1);
}

main().catch((err) => {
  console.error("\nFatal:", err);
  process.exit(1);
});
