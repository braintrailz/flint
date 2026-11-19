#!/usr/bin/env node
/** Inspect proposed evaluation cases; never invokes a model or creates scores. */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseArgs } from "node:util";

export const CASES = fileURLToPath(new URL("../evals/evals.json", import.meta.url));

export function loadCases(path = CASES) {
  const data = JSON.parse(readFileSync(path, "utf8"));
  if (data.skill_name !== "flint" || !Array.isArray(data.evals) || data.evals.length === 0) {
    throw new Error("expected non-empty Flint evaluation cases");
  }
  const ids = new Set();
  for (const item of data.evals) {
    if (!Number.isInteger(item.id) || ids.has(item.id)) throw new Error("case IDs must be unique integers");
    ids.add(item.id);
    for (const key of ["name", "prompt", "expected_output"]) {
      if (typeof item[key] !== "string" || !item[key].trim()) throw new Error(`case ${item.id}: missing ${key}`);
    }
    if (!Array.isArray(item.files) || item.files.some((value) => typeof value !== "string")) {
      throw new Error(`case ${item.id}: files must be strings`);
    }
    if (!Array.isArray(item.expectations) || item.expectations.length === 0 ||
        item.expectations.some((value) => typeof value !== "string" || !value.trim())) {
      throw new Error(`case ${item.id}: expectations must be non-empty text`);
    }
  }
  return data;
}

export function main(argv = process.argv.slice(2), io = { out: console.log, err: console.error }) {
  try {
    const { values } = parseArgs({
      args: argv,
      options: { format: { type: "string", default: "text" }, help: { type: "boolean", short: "h" } },
    });
    if (values.help) {
      io.out("Usage: node scripts/review-evals.mjs [--format text|json]\nReview proposed prompts only. No models, network calls or scores.");
      return 0;
    }
    if (!["text", "json"].includes(values.format)) throw new Error("--format must be text or json");
    const data = loadCases();
    if (values.format === "json") io.out(JSON.stringify(data, null, 2));
    else {
      io.out(data.status);
      for (const item of data.evals) {
        io.out(`\n${item.id}. ${item.name}\nPrompt: ${item.prompt}\nExpected: ${item.expected_output}`);
        for (const expectation of item.expectations) io.out(`  - ${expectation}`);
      }
    }
    return 0;
  } catch (error) {
    io.err(`flint evals: ${error.message}`);
    return 2;
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  process.exitCode = main();
}
