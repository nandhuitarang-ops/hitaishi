/**
 * Hitaishi visual asset generation.
 *
 * Primary:  Gemini 2.5 Flash Image (requires GEMINI_API_KEY in .env.local).
 * Fallback: Pollinations.ai (FLUX) — free, keyless, no quota.
 *
 * Generates art-directed imagery, then emits AVIF + WebP alongside the PNG.
 *
 *   Usage:  npm run gen:hitaishi
 *           npm run gen:hitaishi -- --only=hero-mentor-portrait,lamp-symbol-hero
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public", "images", "hitaishi");

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

const ART_DIRECTION =
  "Warm, mentor-driven Indian editorial photography. Cream and warm-saffron " +
  "palette with deep slate accents. Natural window light, evening tungsten, " +
  "soft shadows. Shallow depth of field, no harsh flash. Subjects are South " +
  "Asian, contemporary, contemplative. No Western imagery, no boarding passes, " +
  "no foreign cities, no graduation caps. No text, no logos, no watermark, " +
  "no captions visible in the image.";

const ASSETS = [
  {
    name: "hero-mentor-portrait",
    aspectRatio: "4:5",
    prompt:
      "A composed young Indian adult in their early twenties at a warm-lit " +
      "desk with a notebook, gently smiling, soft window light from " +
      "screen-left, shallow depth of field. Editorial portrait.",
  },
  {
    name: "mentor-session-laptop",
    aspectRatio: "3:2",
    prompt:
      "Over-the-shoulder shot of a young Indian mentor on a video call with " +
      "a student, laptop visible on a wooden desk, warm bedroom-study " +
      "lighting, no faces toward camera. Editorial reportage.",
  },
  {
    name: "whiteboard-physics",
    aspectRatio: "3:2",
    prompt:
      "Close-up of an Indian student's hands writing Physics equations on a " +
      "whiteboard with a marker, warm tungsten light, gentle motion blur on " +
      "the pen tip. Editorial close-up.",
  },
  {
    name: "hostel-evening-study",
    aspectRatio: "3:2",
    prompt:
      "An Indian college hostel room at evening, a single student seated at " +
      "a lamp-lit desk surrounded by JEE textbooks and notebooks, view from " +
      "the doorway, cozy not lonely. Editorial photography.",
  },
  {
    name: "coaching-classroom-wide",
    aspectRatio: "16:9",
    prompt:
      "A modern Indian coaching institute classroom, rows of teenage " +
      "students seen from behind, instructor at a whiteboard softly out of " +
      "focus, daylight from tall windows. Editorial wide shot.",
  },
  {
    name: "mentor-community-hands",
    aspectRatio: "3:2",
    prompt:
      "Three young Indian college students at a cafe table with open " +
      "laptops and chai cups, only hands and laptops visible, warm " +
      "afternoon light. Editorial detail.",
  },
  {
    name: "lamp-symbol-hero",
    aspectRatio: "1:1",
    prompt:
      "A single brass diya oil lamp with a soft flame on warm cream linen, " +
      "generous negative space around it. Editorial still life.",
  },
  {
    name: "parents-conversation",
    aspectRatio: "3:2",
    prompt:
      "An Indian father and his teenage son seated at a dining table " +
      "reviewing a laptop screen together, warm kitchen light, side angle, " +
      "faces not fully visible. Editorial documentary photography.",
  },
];

function parseOnlyFlag() {
  const arg = process.argv.find((a) => a.startsWith("--only="));
  if (!arg) return null;
  return new Set(arg.slice("--only=".length).split(",").map((s) => s.trim()));
}

function dimsFor(aspect) {
  const [aw, ah] = aspect.split(":").map(Number);
  const longest = 1280;
  return aw >= ah
    ? { width: longest, height: Math.round((longest * ah) / aw) }
    : { width: Math.round((longest * aw) / ah), height: longest };
}

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
      console.warn("    · Gemini: needs billing on this key. Falling back.");
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
      console.warn(`    · Pollinations attempt ${attempt} failed — ${err.message ?? err}`);
      if (attempt < 4) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }
  return null;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const only = parseOnlyFlag();
  const targets = only ? ASSETS.filter((a) => only.has(a.name)) : ASSETS;
  if (only && targets.length === 0) {
    console.error(`No matching assets for --only=${[...only].join(",")}`);
    process.exit(1);
  }

  let succeeded = 0;
  for (const asset of targets) {
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
    await new Promise((r) => setTimeout(r, 1500));
  }

  console.log(`\nDone — ${succeeded}/${targets.length} asset(s) in public/images/hitaishi/\n`);
  if (succeeded === 0) process.exit(1);
}

main().catch((err) => {
  console.error("\nFatal:", err);
  process.exit(1);
});
