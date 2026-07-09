import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

const EXCLUDED_PATTERNS = [
  // Payment Gateway
  /^gpay\./i,
  /^phonpe\./i,
  /^alipay/i,
  /^fps-qr/i,
  // Pricing (class plan placeholders & membership tiers)
  /^600\./i,
  /^1200\./i,
  /^2000\./i,
  /^2500\./i,
  /^silver\./i,
  /^gold\./i,
  /^platinum\./i,
  /^elite\./i,
  // Yoga + Diet
  /^yoga-diet/i,
];

function isExcluded(filename: string): boolean {
  return EXCLUDED_PATTERNS.some((p) => p.test(filename));
}

function scanDir(
  dir: string,
  basePrefix: string,
  results: { src: string; filename: string }[]
): void {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  entries.sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const fullPath = path.join(dir, entry.name);
    const srcPath = `${basePrefix}/${entry.name}`;
    if (entry.isDirectory()) {
      scanDir(fullPath, srcPath, results);
    } else if (entry.isFile() && IMAGE_EXTS.has(path.extname(entry.name).toLowerCase())) {
      if (isExcluded(entry.name)) continue;
      results.push({ src: srcPath, filename: entry.name });
    }
  }
}

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), "public");
    const files: { src: string; filename: string }[] = [];
    scanDir(publicDir, "", files);
    files.sort((a, b) => a.filename.localeCompare(b.filename));
    return NextResponse.json(files);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
