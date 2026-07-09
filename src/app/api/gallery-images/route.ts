import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

export async function GET() {
  try {
    const imagesDir = path.join(process.cwd(), "public", "images");
    const entries = fs.readdirSync(imagesDir, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile() && IMAGE_EXTS.has(path.extname(e.name).toLowerCase()))
      .map((e) => ({
        src: `/images/${e.name}`,
        filename: e.name,
      }))
      .sort((a, b) => a.filename.localeCompare(b.filename));

    return NextResponse.json(files);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
