import assert from "node:assert/strict";
import { test } from "node:test";
import {
  cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync,
  realpathSync, rmSync, symlinkSync, unlinkSync, writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { inflateRawSync } from "node:zlib";
import { ARTIFACTS, links, main, MAX_BYTES, validate, VERSION } from "../skills/flint/scripts/validate.mjs";
import { build, crc32, FILES, ROOT, SOURCE } from "../scripts/package.mjs";
import { loadCases, main as reviewMain } from "../scripts/review-evals.mjs";

const CARD = `# Synthetic card
## 1. Purpose
Original instruction: "Define a read-only local link checker."
## 2. Success
An offline definition, not an implementation.
## 3. Authority
Can: write definition files. Needs approval: code. Never: network.
## 4. Judgment
Choose a minimal approach; escalate scope changes.
## 5. Action
Preserve existing work; no execution.
## 6. Trust
Report actual files and checks, not claims of model effectiveness.
`;

function fixture(t) {
  const temp = realpathSync(mkdtempSync(join(tmpdir(), "flint-test-")));
  t.after(() => rmSync(temp, { recursive: true, force: true }));
  const root = join(temp, "project");
  mkdirSync(root);
  for (const name of ARTIFACTS) {
    writeFileSync(join(root, name), readFileSync(join(SOURCE, "assets", name), "utf8")
      .replace(/\{\{[^}]+\}\}/g, "Synthetic value; owner: user; gate: before build."));
  }
  writeFileSync(join(root, "TRAILCARD.md"), CARD);
  return { root, temp };
}
function append(root, name, text) {
  const path = join(root, name);
  writeFileSync(path, `${readFileSync(path, "utf8")}\n${text}\n`);
}
function codes(root) {
  return validate(root).errors.map((entry) => entry.code);
}

test("filled templates pass without project writes", (t) => {
  const { root } = fixture(t);
  const snapshot = () => readdirSync(root).sort().map((name) => [name, readFileSync(join(root, name)).toString()]);
  const before = snapshot();
  const report = validate(root);
  assert.equal(report.passed, true, JSON.stringify(report));
  assert.equal(report.filesChecked.length, 6);
  assert.deepEqual(report.warnings, []);
  assert.deepEqual(snapshot(), before);
});
for (const name of [...ARTIFACTS, "TRAILCARD.md"]) {
  test(`reject missing ${name}`, (t) => {
    const { root } = fixture(t);
    unlinkSync(join(root, name));
    assert.ok(codes(root).includes("missing_file"));
  });
}
for (const title of ["Purpose", "Success", "Authority", "Judgment", "Action", "Trust"]) {
  test(`require card section ${title}`, (t) => {
    const { root } = fixture(t);
    writeFileSync(join(root, "TRAILCARD.md"), CARD.replace(new RegExp(`## \\d\\. ${title}`), "## Other"));
    assert.ok(codes(root).includes("card_section"));
  });
}
for (const title of ["Purpose", "Decision", "Delivery envelope"]) {
  test(`require project heading ${title}`, (t) => {
    const { root } = fixture(t);
    const path = join(root, "1-PROJECT.md");
    writeFileSync(path, readFileSync(path, "utf8").replace(`## ${title}\n`, "## Other\n"));
    assert.ok(codes(root).includes("section"));
  });
}
test("reject placeholders, duplicate IDs and missing acceptance", (t) => {
  const { root } = fixture(t);
  append(root, "3-SPEC.md", "{{fill this}}\n**FR-01: Duplicate.**");
  const path = join(root, "3-SPEC.md");
  writeFileSync(path, readFileSync(path, "utf8").replace("## Acceptance", "## Other"));
  for (const code of ["placeholder", "duplicate_id", "section"]) assert.ok(codes(root).includes(code));
});
for (const prefix of ["FR", "NFR"]) {
  test(`require ${prefix} definitions`, (t) => {
    const { root } = fixture(t);
    const path = join(root, "3-SPEC.md");
    writeFileSync(path, readFileSync(path, "utf8").replace(`**${prefix}-01:`, "**Example:"));
    assert.ok(codes(root).includes("requirement_ids"));
  });
}
test("require a title and slice exit", (t) => {
  const { root } = fixture(t);
  writeFileSync(join(root, "2-TERMS.md"), "plain text");
  const path = join(root, "4-PLAN.md");
  writeFileSync(path, readFileSync(path, "utf8").replace("**Exit:**", "**Result:**"));
  assert.ok(codes(root).includes("headings"));
  assert.ok(codes(root).includes("exit"));
});
test("check local files/fragments and encoded spaces", (t) => {
  const { root } = fixture(t);
  writeFileSync(join(root, "a file.md"), "# File\n## Same\nOne\n## Same\nTwo\n");
  append(root, "2-TERMS.md", "[ok](a%20file.md#same-1)\n[ok](<a file.md>)");
  assert.equal(validate(root).passed, true);
  append(root, "2-TERMS.md", "[missing](absent.md)\n[missing](1-PROJECT.md#absent)");
  assert.ok(codes(root).includes("broken_link"));
  assert.ok(codes(root).includes("broken_anchor"));
});
test("ignore fenced examples, do not fetch web links, reject active schemes", (t) => {
  const { root } = fixture(t);
  append(root, "3-SPEC.md", "```md\n**FR-01: Example.**\n[bad](absent.md)\n{{example}}\n```");
  append(root, "2-TERMS.md", "[web](https://example.invalid/no-such-page)");
  assert.equal(validate(root).passed, true);
  append(root, "2-TERMS.md", "[bad](javascript:example)");
  assert.ok(codes(root).includes("link_scheme"));
});
test("outside references warn without reading them", (t) => {
  const { root } = fixture(t);
  append(root, "2-TERMS.md", "[outside](../does-not-exist.md#not-read)");
  const result = validate(root);
  assert.equal(result.passed, true);
  assert.ok(result.warnings.some((entry) => entry.code === "external_local_link"));
});
test("reject artifact/ancestor-link symlink escapes", { skip: process.platform === "win32" }, (t) => {
  const { root, temp } = fixture(t);
  const outside = join(temp, "outside");
  mkdirSync(outside);
  writeFileSync(join(outside, "file.md"), "# Not read\n");
  unlinkSync(join(root, "2-TERMS.md"));
  symlinkSync(join(outside, "file.md"), join(root, "2-TERMS.md"));
  symlinkSync(outside, join(root, "alias"), "dir");
  append(root, "1-PROJECT.md", "[escape](alias/file.md)");
  assert.ok(codes(root).includes("path_escape"));
  assert.ok(codes(root).includes("link_escape"));
});
test("bound reads and reject invalid UTF-8", (t) => {
  const { root } = fixture(t);
  writeFileSync(join(root, "2-TERMS.md"), Buffer.from([0xff]));
  writeFileSync(join(root, "5-DESIGN.md"), Buffer.alloc(MAX_BYTES + 1, 120));
  assert.ok(codes(root).includes("unreadable"));
  assert.ok(codes(root).includes("too_large"));
});
test("support an explicitly supplied shared card", (t) => {
  const { root, temp } = fixture(t);
  unlinkSync(join(root, "TRAILCARD.md"));
  const path = join(root, "1-PROJECT.md");
  writeFileSync(path, readFileSync(path, "utf8").replace("(TRAILCARD.md)", "(../shared.md)"));
  const trailcard = join(temp, "shared.md");
  writeFileSync(trailcard, CARD);
  assert.equal(validate(root, { trailcard }).passed, true);
});
test("CLI JSON and exit codes 0, 1, 2", (t) => {
  const { root } = fixture(t);
  const out = [];
  const io = { out: (line) => out.push(line), err: () => {} };
  assert.equal(main([root, "--format", "json"], io), 0);
  assert.equal(JSON.parse(out.pop()).passed, true);
  unlinkSync(join(root, "2-TERMS.md"));
  assert.equal(main([root], io), 1);
  for (const args of [[], [join(root, "absent")], [root, "--format", "bad"], [root, "--surprise"]]) {
    assert.equal(main(args, io), 2);
  }
  assert.equal(main(["--help"], io), 0);
});
test("CRC32 matches the standard test vector", () => {
  assert.equal(crc32(Buffer.from("123456789")), 0xcbf43926);
});
test("archive is deterministic, allowlisted and relocatable", (t) => {
  const { root, temp } = fixture(t);
  const source = join(temp, "source");
  cpSync(SOURCE, source, { recursive: true });
  writeFileSync(join(source, "private.md"), "Synthetic excluded data.");
  const first = build({ output: join(temp, "one.skill"), source });
  const second = build({ output: join(temp, "two.skill"), source });
  const bytes = readFileSync(first);
  assert.deepEqual(bytes, readFileSync(second));
  assert.equal(bytes.readUInt32LE(bytes.length - 22), 0x06054b50);
  assert.equal(bytes.readUInt16LE(bytes.length - 12), FILES.length);
  const names = [];
  const unpacked = join(temp, "unpacked");
  let offset = 0;
  while (bytes.readUInt32LE(offset) === 0x04034b50) {
    const size = bytes.readUInt32LE(offset + 18);
    const length = bytes.readUInt16LE(offset + 26);
    const name = bytes.subarray(offset + 30, offset + 30 + length).toString();
    const start = offset + 30 + length;
    const raw = inflateRawSync(bytes.subarray(start, start + size));
    assert.equal(crc32(raw), bytes.readUInt32LE(offset + 14));
    assert.ok(!name.split("/").includes(".."));
    const path = join(unpacked, name);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, raw);
    names.push(name);
    offset = start + size;
  }
  assert.equal(bytes.readUInt32LE(offset), 0x02014b50);
  assert.deepEqual(names.sort(), FILES.map((name) => `flint/${name}`).sort());
  assert.equal(readFileSync(join(unpacked, "flint/LICENSE"), "utf8"),
    readFileSync(join(ROOT, "LICENSE"), "utf8"));
  const run = spawnSync(process.execPath, [
    join(unpacked, "flint/scripts/validate.mjs"), root, "--format", "json",
  ], { encoding: "utf8" });
  assert.equal(run.status, 0, run.stderr);
  assert.equal(JSON.parse(run.stdout).passed, true);
});
test("packager refuses overwrite, bad destinations and symlinks", (t) => {
  const { temp } = fixture(t);
  const output = join(temp, "artifact.skill");
  build({ output });
  assert.throws(() => build({ output }), /already exists/);
  assert.equal(build({ output, force: true }), output);
  assert.throws(() => build({ output: join(temp, "TRAILCARD.md") }), /must end/);
  assert.throws(() => build({ output: join(SOURCE, "bad.skill") }), /outside the skill/);
  if (process.platform !== "win32") {
    const dangling = join(temp, "dangling.skill");
    symlinkSync(join(temp, "not-created"), dangling);
    assert.throws(() => build({ output: dangling, force: true }), /symlink/);
    assert.equal(existsSync(join(temp, "not-created")), false);
    const source = join(temp, "source");
    cpSync(SOURCE, source, { recursive: true });
    unlinkSync(join(source, "references/examples.md"));
    symlinkSync(join(SOURCE, "references/examples.md"), join(source, "references/examples.md"));
    assert.throws(() => build({ output: join(temp, "bad.skill"), source }), /symlink/);
  }
});
test("skill metadata, linked resources and Node versions agree", () => {
  const text = readFileSync(join(SOURCE, "SKILL.md"), "utf8");
  const metadata = text.split("---")[1];
  assert.match(metadata, /^name: flint$/m);
  assert.ok(metadata.match(/^description: (.+)$/m)[1].length <= 1024);
  assert.ok(text.split("\n").length < 500);
  assert.ok(text.includes(`version: "${VERSION}"`));
  assert.ok(text.includes("requires: trailcard"));
  assert.ok(!text.includes("/Users/"));
  for (const name of FILES.filter((value) => value === "SKILL.md" || value.startsWith("references/"))) {
    for (const target of links(readFileSync(join(SOURCE, name), "utf8"))) {
      if (/^[a-z]+:/i.test(target)) continue;
      assert.ok(existsSync(join(dirname(join(SOURCE, name)), target.split("#")[0])), target);
    }
  }
  assert.equal(JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")).version, VERSION);
});

test("evaluation cases are reviewable without model runs or invented scores", (t) => {
  const { temp } = fixture(t);
  const data = loadCases();
  assert.equal(data.evals.length, 4);
  assert.match(data.status, /No model runs/);
  const out = [];
  const io = { out: (line) => out.push(line), err: () => {} };
  assert.equal(reviewMain(["--format", "json"], io), 0);
  assert.equal(JSON.parse(out.pop()).skill_name, "flint");
  assert.equal(reviewMain(["--format", "bad"], io), 2);
  assert.equal(reviewMain(["--help"], io), 0);
  const path = join(temp, "cases.json");
  data.evals[1].id = data.evals[0].id;
  writeFileSync(path, JSON.stringify(data));
  assert.throws(() => loadCases(path), /unique/);
});
