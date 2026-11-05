import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { Database } from "./types";
import { seedDatabase } from "./seed";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

let writeQueue: Promise<unknown> = Promise.resolve();

async function ensureFile(): Promise<void> {
  try {
    await fs.access(DB_FILE);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const seed = await seedDatabase();
    await fs.writeFile(DB_FILE, JSON.stringify(seed, null, 2), "utf8");
  }
}

export async function readDb(): Promise<Database> {
  await ensureFile();
  const raw = await fs.readFile(DB_FILE, "utf8");
  const db = JSON.parse(raw) as Partial<Database>;
  // Forward-compatible: fill in sections added after the file was first written.
  if (!db.faqs || !db.care) {
    const seed = await seedDatabase();
    db.faqs = db.faqs ?? seed.faqs;
    db.care = db.care ?? seed.care;
  }
  return db as Database;
}

export async function writeDb(db: Database): Promise<void> {
  const tmp = DB_FILE + ".tmp";
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
  await fs.rename(tmp, DB_FILE);
}

/** Serialised read-modify-write so concurrent admin edits never clobber each other. */
export async function updateDb<T>(fn: (db: Database) => T | Promise<T>): Promise<T> {
  const run = async () => {
    const db = await readDb();
    const result = await fn(db);
    await writeDb(db);
    return result;
  };
  const p = writeQueue.then(run, run);
  writeQueue = p.catch(() => undefined);
  return p;
}

export function newId(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
