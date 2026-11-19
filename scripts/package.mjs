#!/usr/bin/env node
/** Build a deterministic, allowlisted ZIP using Node built-ins. No install/upload. */
import { existsSync, lstatSync, mkdirSync, realpathSync, writeFileSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import { deflateRawSync } from "node:zlib";
import { isWithin, readBounded } from "../skills/flint/scripts/validate.mjs";

export const ROOT = fileURLToPath(new URL("../", import.meta.url));
export const SOURCE = resolve(ROOT, "skills/flint");
export const FILES = [
  "SKILL.md", "assets/DECISION.md", "assets/1-PROJECT.md", "assets/2-TERMS.md",
  "assets/3-SPEC.md", "assets/4-PLAN.md", "assets/5-DESIGN.md",
  "references/braintrailz.md", "references/decisions.md", "references/envelope.md",
  "references/examples.md", "scripts/validate.mjs",
];

export function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/** Small ZIP32 encoder for this fixed set of bounded UTF-8 text resources. */
export function encodeZip(entries) {
  const local = [];
  const central = [];
  let offset = 0;
  for (const [name, raw] of entries) {
    const filename = Buffer.from(name);
    const compressed = deflateRawSync(raw);
    const crc = crc32(raw);
    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0);
    header.writeUInt16LE(20, 4);
    header.writeUInt16LE(0x800, 6); // UTF-8 names.
    header.writeUInt16LE(8, 8);
    header.writeUInt16LE(0x21, 12); // Fixed 1980-01-01 date.
    header.writeUInt32LE(crc, 14);
    header.writeUInt32LE(compressed.length, 18);
    header.writeUInt32LE(raw.length, 22);
    header.writeUInt16LE(filename.length, 26);
    local.push(header, filename, compressed);
    const directory = Buffer.alloc(46);
    directory.writeUInt32LE(0x02014b50, 0);
    directory.writeUInt16LE(20, 4);
    directory.writeUInt16LE(20, 6);
    directory.writeUInt16LE(0x800, 8);
    directory.writeUInt16LE(8, 10);
    directory.writeUInt16LE(0x21, 14);
    directory.writeUInt32LE(crc, 16);
    directory.writeUInt32LE(compressed.length, 20);
    directory.writeUInt32LE(raw.length, 24);
    directory.writeUInt16LE(filename.length, 28);
    directory.writeUInt32LE(offset, 42);
    central.push(directory, filename);
    offset += header.length + filename.length + compressed.length;
  }
  const directory = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(directory.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, directory, end]);
}

export function build({ output, source = SOURCE, force = false } = {}) {
  source = realpathSync(source);
  const entries = [...FILES].sort().map((name) => {
    const path = resolve(source, name);
    if (lstatSync(path).isSymbolicLink() || !isWithin(source, realpathSync(path))) {
      throw new Error(`package path must not escape or be a symlink: ${name}`);
    }
    return [`flint/${name}`, Buffer.from(readBounded(path))];
  });
  const skill = entries.find(([name]) => name === "flint/SKILL.md")[1].toString();
  const version = skill.match(/^[ \t]+version: "(\d+\.\d+\.\d+)"$/m)?.[1];
  if (!version || !skill.startsWith("---\nname: flint\n")) throw new Error("unexpected skill name/version");
  output = resolve(output ?? resolve(ROOT, "dist", `flint-${version}.skill`));
  if (![".skill", ".zip"].includes(extname(output))) throw new Error("output must end in .skill or .zip");
  if (isWithin(source, output) || (existsSync(output) && lstatSync(output).isSymbolicLink())) {
    throw new Error("archive output must be outside the skill and not a symlink");
  }
  mkdirSync(dirname(output), { recursive: true });
  if (isWithin(source, realpathSync(dirname(output)))) throw new Error("archive parent resolves inside the skill");
  if (existsSync(output) && !force) throw new Error("output already exists; use --force for a derived archive");
  // Refuse a dangling symlink as well as an existing one.
  try {
    if (lstatSync(output).isSymbolicLink()) throw new Error("archive output must not be a symlink");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  writeFileSync(output, encodeZip(entries), { flag: force ? "w" : "wx" });
  return output;
}

export function main(argv = process.argv.slice(2), io = { out: console.log, err: console.error }) {
  try {
    const { values } = parseArgs({
      args: argv,
      options: { out: { type: "string" }, force: { type: "boolean" }, help: { type: "boolean", short: "h" } },
    });
    if (values.help) {
      io.out("Usage: node scripts/package.mjs [--out ARCHIVE.skill] [--force]\nBuild only; no install or publication.");
      return 0;
    }
    io.out(build({ output: values.out, force: values.force }));
    return 0;
  } catch (error) {
    io.err(`flint package: ${error.message}`);
    return 2;
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  process.exitCode = main();
}
