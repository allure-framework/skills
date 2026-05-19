#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

type FrontmatterResult = {
  fields: Record<string, string>;
  errors: string[];
};

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const skillsDir = join(root, "skills");
const rootClaudeMd = join(root, "CLAUDE.md");
const maxSkillNameLength = 64;
const maxDescriptionLength = 1024;
const maxSkillFileBytes = 1_000_000;
const maxSkillTotalBytes = 5_000_000;
const skillNamePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const resourcePathPattern =
  /`((?:references|scripts|assets)\/[^`\s]+)`|\[[^\]]+\]\(((?:references|scripts|assets)\/[^)\s]+)\)/g;

const unquote = (value: string): string => {
  const trimmed = value.trim();
  const first = trimmed.at(0);
  const last = trimmed.at(-1);

  if (trimmed.length >= 2 && first === last && (first === `"` || first === `'`)) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
};

const parseFrontmatter = (skillMd: string): FrontmatterResult => {
  const errors: string[] = [];
  const text = readFileSync(skillMd, "utf8");

  if (!text.startsWith("---\n")) {
    return { fields: {}, errors: ["SKILL.md must start with YAML frontmatter"] };
  }

  const end = text.indexOf("\n---", 4);
  if (end === -1) {
    return { fields: {}, errors: ["SKILL.md frontmatter is not closed"] };
  }

  const fields: Record<string, string> = {};
  for (const line of text.slice(4, end).split("\n")) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const match = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(trimmed);
    if (!match) {
      errors.push(`Unsupported frontmatter line: ${line}`);
      continue;
    }

    fields[match[1]] = unquote(match[2]);
  }

  return { fields, errors };
};

const parseOpenAIInterface = (openaiYaml: string): Record<string, string> => {
  const fields: Record<string, string> = {};
  let inInterface = false;

  for (const line of readFileSync(openaiYaml, "utf8").split("\n")) {
    if (!line.trim() || line.trimStart().startsWith("#")) {
      continue;
    }

    if (/^[A-Za-z0-9_-]+:/.test(line)) {
      inInterface = line.startsWith("interface:");
      continue;
    }

    if (inInterface) {
      const match = /^\s{2}([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
      if (match) {
        fields[match[1]] = unquote(match[2]);
      }
    }
  }

  return fields;
};

const findResourceMentions = (skillMd: string): Set<string> => {
  const text = readFileSync(skillMd, "utf8");
  const mentions = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = resourcePathPattern.exec(text))) {
    mentions.add(match[1] ?? match[2]);
  }

  return mentions;
};

const listFiles = (dir: string): string[] => {
  const files: string[] = [];

  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      files.push(...listFiles(path));
    } else if (stat.isFile()) {
      files.push(path);
    }
  }

  return files;
};

const validateSkill = (skillDir: string): string[] => {
  const errors: string[] = [];
  const skillFolderName = basename(skillDir);
  const skillMd = join(skillDir, "SKILL.md");
  const claudeMd = join(skillDir, "CLAUDE.md");
  const openaiYaml = join(skillDir, "agents", "openai.yaml");

  if (!existsSync(skillMd)) {
    return [`${skillDir}: missing SKILL.md`];
  }

  const { fields, errors: frontmatterErrors } = parseFrontmatter(skillMd);
  errors.push(...frontmatterErrors.map((error) => `${skillFolderName}: ${error}`));

  if (!existsSync(claudeMd)) {
    errors.push(`${skillFolderName}: missing CLAUDE.md`);
  } else {
    const claudeText = readFileSync(claudeMd, "utf8").trim();
    if (!claudeText) {
      errors.push(`${skillFolderName}: CLAUDE.md must not be empty`);
    } else if (!claudeText.includes("SKILL.md")) {
      errors.push(`${skillFolderName}: CLAUDE.md must reference SKILL.md`);
    }
  }

  const name = (fields.name ?? "").trim();
  const description = (fields.description ?? "").trim();

  if (!name) {
    errors.push(`${skillFolderName}: missing frontmatter name`);
  } else if (skillFolderName !== name) {
    errors.push(`${skillFolderName}: folder name must match frontmatter name ${JSON.stringify(name)}`);
  }

  if (name && !skillNamePattern.test(name)) {
    errors.push(`${skillFolderName}: skill name must be lowercase hyphen-case`);
  }

  if (name.length > maxSkillNameLength) {
    errors.push(`${skillFolderName}: skill name exceeds ${maxSkillNameLength} characters`);
  }

  if (!description) {
    errors.push(`${skillFolderName}: missing frontmatter description`);
  } else if (description.length > maxDescriptionLength) {
    errors.push(`${skillFolderName}: description exceeds ${maxDescriptionLength} characters`);
  }

  const skillFiles = listFiles(skillDir);
  if (skillFiles.some((path) => basename(path).toLowerCase() === "readme.md")) {
    errors.push(`${skillFolderName}: skill folders must not contain README.md`);
  }

  for (const mention of findResourceMentions(skillMd)) {
    if (!existsSync(join(skillDir, mention))) {
      errors.push(`${skillFolderName}: referenced resource does not exist: ${mention}`);
    }
  }

  if (!existsSync(openaiYaml)) {
    errors.push(`${skillFolderName}: missing agents/openai.yaml`);
  } else {
    const interfaceFields = parseOpenAIInterface(openaiYaml);

    for (const key of ["display_name", "short_description", "default_prompt"]) {
      if (!interfaceFields[key]?.trim()) {
        errors.push(`${skillFolderName}: agents/openai.yaml missing interface.${key}`);
      }
    }

    if (name && !interfaceFields.default_prompt?.includes(`$${name}`)) {
      errors.push(`${skillFolderName}: interface.default_prompt must reference $${name}`);
    }
  }

  let totalBytes = 0;
  for (const file of skillFiles) {
    const size = statSync(file).size;
    totalBytes += size;

    if (size > maxSkillFileBytes) {
      errors.push(`${skillFolderName}: ${relative(skillDir, file)} exceeds ${maxSkillFileBytes} bytes`);
    }
  }

  if (totalBytes > maxSkillTotalBytes) {
    errors.push(`${skillFolderName}: total skill size exceeds ${maxSkillTotalBytes} bytes`);
  }

  return errors;
};

const main = (): number => {
  if (!existsSync(rootClaudeMd)) {
    console.error("CLAUDE.md does not exist");
    return 1;
  }

  if (!existsSync(skillsDir)) {
    console.error("skills directory does not exist");
    return 1;
  }

  const skillDirs = readdirSync(skillsDir)
    .map((entry) => join(skillsDir, entry))
    .filter((entry) => statSync(entry).isDirectory())
    .sort();

  if (skillDirs.length === 0) {
    console.error("no skills found");
    return 1;
  }

  const errors = skillDirs.flatMap(validateSkill);
  if (errors.length > 0) {
    console.log("Skill validation failed:");
    for (const error of errors) {
      console.log(`- ${error}`);
    }
    return 1;
  }

  console.log(`Validated ${skillDirs.length} skill(s).`);
  return 0;
};

process.exitCode = main();
