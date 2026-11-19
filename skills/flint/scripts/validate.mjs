#!/usr/bin/env node
/**
 * Read-only structural checks, not a semantic or approval verdict.
 * Node 22+. No network, dependencies or project writes.
 */
import {
  closeSync, existsSync, fstatSync, openSync, readSync, realpathSync, statSync,
} from "node:fs";
import { dirname, extname, isAbsolute, relative, resolve, sep } from "node:path";
import { parseArgs } from "node:util";
import { pathToFileURL } from "node:url";

export const VERSION = "0.1.0";
export const MAX_BYTES = 1024 * 1024;
export const ARTIFACTS = [
  "1-PROJECT.md", "2-TERMS.md", "3-SPEC.md", "4-PLAN.md", "5-DESIGN.md",
];

export function isWithin(root, path) {
  const part = relative(root, path);
  return part === "" || (!isAbsolute(part) && part !== ".." && !part.startsWith(`..${sep}`));
}

export function readBounded(path) {
  const fd = openSync(path, "r");
  try {
    if (!fstatSync(fd).isFile()) throw new Error("expected a regular file");
    const buffer = Buffer.alloc(MAX_BYTES + 1);
    let size = 0;
    while (size < buffer.length) {
      const count = readSync(fd, buffer, size, buffer.length - size, null);
      if (!count) break;
      size += count;
    }
    if (size > MAX_BYTES) throw new RangeError("file exceeds the 1 MiB read limit");
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer.subarray(0, size));
  } finally {
    closeSync(fd);
  }
}

export function visibleMarkdown(text) {
  let fence;
  return text.split(/\r?\n/).map((line) => {
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (marker) {
      const chars = marker[1];
      if (!fence) fence = chars;
      else if (chars[0] === fence[0] && chars.length >= fence.length) fence = undefined;
      return "";
    }
    return fence ? "" : line;
  }).join("\n");
}

export function headingNames(text) {
  return [...visibleMarkdown(text).matchAll(/^ {0,3}#{1,6}[ \t]+(.+?)[ \t]*#*[ \t]*$/gm)]
    .map((match) => match[1]);
}

export function anchors(text) {
  const result = new Set();
  for (const heading of headingNames(text)) {
    const base = heading.toLowerCase().replace(/[^\p{L}\p{N}_ -]/gu, "").replaceAll(" ", "-");
    let slug = base;
    for (let index = 1; result.has(slug); index++) slug = `${base}-${index}`;
    result.add(slug);
  }
  for (const match of text.matchAll(/<a\s+[^>]*id=["']([^"']+)["']/g)) result.add(match[1]);
  return result;
}

/** Supported subset: inline links/images; angle-wrapped targets allow spaces. */
export function links(text) {
  return [...visibleMarkdown(text).matchAll(/!?\[[^\]\n]*\]\((<[^>\n]+>|[^()\s]+)\)/g)]
    .map((match) => match[1].replace(/^<|>$/g, ""));
}

export function validate(project, { trailcard } = {}) {
  const root = realpathSync(resolve(project));
  if (!statSync(root).isDirectory()) throw new Error(`not a project directory: ${root}`);
  const card = trailcard ? realpathSync(resolve(trailcard)) : resolve(root, "TRAILCARD.md");
  const report = {
    version: VERSION,
    scope: "structural only; no semantic, safety, approval or viability verdict",
    root, filesChecked: [], errors: [], warnings: [],
  };
  const cache = new Map();
  function issue(level, path, code, message) {
    const entry = { path, code, message };
    if (!report[level].some((item) => JSON.stringify(item) === JSON.stringify(entry))) {
      report[level].push(entry);
    }
  }
  function load(path, boundary = root) {
    try {
      if (!existsSync(path)) {
        issue("errors", path, "missing_file", "expected a regular file");
        return;
      }
      if (!isWithin(boundary, realpathSync(path))) {
        issue("errors", path, "path_escape", "file resolves outside the declared boundary");
        return;
      }
      if (!cache.has(path)) cache.set(path, readBounded(path));
      return cache.get(path);
    } catch (error) {
      issue("errors", path, error instanceof RangeError ? "too_large" : "unreadable", error.message);
    }
  }
  const files = [...ARTIFACTS.map((name) => resolve(root, name)), card];
  for (const path of files) {
    const boundary = path === card && trailcard ? dirname(card) : root;
    const text = load(path, boundary);
    if (text === undefined) continue;
    report.filesChecked.push(path);
    const visible = visibleMarkdown(text);
    const headings = headingNames(text).map((name) => name.replace(/^\d+[.)]\s*/, "").toLowerCase());
    if (!/^#\s+\S/m.test(visible) || headings.length < 2) {
      issue("errors", path, "headings", "expected a title and at least one section");
    }
    if (/\{\{[^}\n]+\}\}/.test(visible)) issue("errors", path, "placeholder", "unfilled template marker");
    if (path === resolve(root, "1-PROJECT.md")) {
      for (const [label, pattern] of [
        ["purpose", /\b(purpose|objective)\b/],
        ["decision", /\bdecision/],
        ["delivery envelope", /\bdelivery envelope\b/],
      ]) {
        if (!headings.some((name) => pattern.test(name))) issue("errors", path, "section", `missing ${label} heading`);
      }
    }
    if (path === resolve(root, "3-SPEC.md")) {
      if (!headings.some((name) => name.includes("acceptance"))) {
        issue("errors", path, "section", "missing acceptance heading");
      }
      const ids = [...visible.matchAll(/^\s*(?:-\s*)?\*\*((?:FR|NFR)-\d{2,})(?=\s*[:—.]|\*\*)/gm)]
        .map((match) => match[1]);
      for (const prefix of ["FR-", "NFR-"]) {
        if (!ids.some((id) => id.startsWith(prefix))) {
          issue("errors", path, "requirement_ids", `no ${prefix} definition found`);
        }
      }
      for (const id of new Set(ids)) {
        if (ids.filter((value) => value === id).length > 1) issue("errors", path, "duplicate_id", id);
      }
    }
    if (path === resolve(root, "4-PLAN.md") && !/\bExit\b/i.test(visible)) {
      issue("errors", path, "exit", "no declared slice exit");
    }
    if (path === card) {
      for (const aliases of [
        ["purpose", "intent"], ["success", "acceptable outcome"], ["authority", "capabilities"],
        ["judgment", "bounded choice"], ["action", "execution"], ["trust", "evidence"],
      ]) {
        if (!headings.some((name) => aliases.some((alias) => name.includes(alias)))) {
          issue("errors", path, "card_section", `missing ${aliases[0]} section`);
        }
      }
    }
    for (const target of links(visible)) {
      const scheme = target.match(/^([a-z][a-z\d+.-]*):/i)?.[1].toLowerCase();
      if (scheme || target.startsWith("//")) {
        if (scheme && !["http", "https", "mailto"].includes(scheme)) {
          issue("errors", path, "link_scheme", `unsupported scheme: ${scheme}`);
        }
        continue; // Never fetch external resources.
      }
      try {
        const hash = target.indexOf("#");
        const rawPath = (hash < 0 ? target : target.slice(0, hash)).split("?")[0];
        const fragment = hash < 0 ? undefined : decodeURIComponent(target.slice(hash + 1));
        const candidate = rawPath ? resolve(dirname(path), decodeURIComponent(rawPath)) : path;
        if (!isWithin(boundary, candidate)) {
          issue("warnings", path, "external_local_link", `not inspected outside the declared boundary: ${target}`);
          continue;
        }
        if (!existsSync(candidate)) {
          issue("errors", path, "broken_link", target);
          continue;
        }
        if (!isWithin(boundary, realpathSync(candidate))) {
          issue("errors", path, "link_escape", `symlink escape: ${target}`);
          continue;
        }
        if (fragment) {
          if (!statSync(candidate).isFile() || extname(candidate).toLowerCase() !== ".md") {
            issue("warnings", path, "unchecked_anchor", target);
            continue;
          }
          const linked = load(candidate, boundary);
          if (linked !== undefined && !anchors(linked).has(fragment)) {
            issue("errors", path, "broken_anchor", target);
          }
        }
      } catch (error) {
        issue("errors", path, "link_unreadable", error.message);
      }
    }
  }
  report.passed = report.errors.length === 0;
  return report;
}

export function main(argv = process.argv.slice(2), io = { out: console.log, err: console.error }) {
  try {
    const { values, positionals } = parseArgs({
      args: argv, allowPositionals: true, strict: true,
      options: { format: { type: "string", default: "text" }, trailcard: { type: "string" }, help: { type: "boolean", short: "h" } },
    });
    if (values.help) {
      io.out("Usage: node validate.mjs PROJECT [--trailcard CARD] [--format text|json]\n" +
        "Read-only structural checks. Exit 0: no errors; 1: findings; 2: usage/root error.\n" +
        "Inline Markdown links and ATX headings only. No network or project writes.");
      return 0;
    }
    if (positionals.length !== 1 || !["text", "json"].includes(values.format)) {
      throw new Error("expected PROJECT and --format text|json; use --help");
    }
    const report = validate(positionals[0], { trailcard: values.trailcard });
    if (values.format === "json") io.out(JSON.stringify(report, null, 2));
    else {
      io.out(report.passed ? "PASS (structure only)" : "FAIL (structural findings)");
      for (const level of ["errors", "warnings"]) {
        for (const item of report[level]) io.out(`${level.slice(0, -1).toUpperCase()} ${item.path}: ${item.code}: ${item.message}`);
      }
      io.out(`${report.filesChecked.length} files; ${report.errors.length} errors; ${report.warnings.length} warnings`);
      io.out(report.scope);
    }
    return report.passed ? 0 : 1;
  } catch (error) {
    io.err(`flint: ${error.message}`);
    return 2;
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  process.exitCode = main();
}
