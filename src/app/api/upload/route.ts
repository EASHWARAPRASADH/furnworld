import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import { getSession } from "@/lib/auth";
import { newId } from "@/lib/db";


export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const files = form.getAll("file").filter((f): f is File => f instanceof File);
  if (files.length === 0) return NextResponse.json({ error: "No file" }, { status: 400 });

  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  const urls: string[] = [];

  for (const file of files) {
    if (!file.type.startsWith("image/")) continue;
    if (file.size > 25 * 1024 * 1024) continue;
    const buf = Buffer.from(await file.arrayBuffer());
    const base = `${newId("img")}`;
    const isSvg = file.type === "image/svg+xml";
    if (isSvg) {
      await fs.writeFile(path.join(dir, `${base}.svg`), buf);
      urls.push(`/uploads/${base}.svg`);
      continue;
    }
    const out = await sharp(buf).rotate().resize({ width: 2200, height: 2200, fit: "inside", withoutEnlargement: true }).webp({ quality: 86 }).toBuffer();
    await fs.writeFile(path.join(dir, `${base}.webp`), out);
    urls.push(`/uploads/${base}.webp`);
  }
  return NextResponse.json({ urls });
}
