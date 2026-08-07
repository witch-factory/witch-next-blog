import { copyFile, mkdir, readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

const projectRoot = process.cwd();

const syncTargets = [
  {
    kind: 'ko',
    sourceRoot: path.join(projectRoot, 'content', 'posts'),
    publicRoot: path.join(projectRoot, 'public', 'static', 'posts'),
  },
  {
    kind: 'en',
    sourceRoot: path.join(projectRoot, 'content', 'en-posts'),
    publicRoot: path.join(projectRoot, 'public', 'static', 'posts'),
  },
  {
    kind: 'translation',
    sourceRoot: path.join(projectRoot, 'content', 'translations'),
    publicRoot: path.join(projectRoot, 'public', 'static', 'translations'),
  },
];

function isRelativeAssetPath(assetPath) {
  return assetPath.startsWith('./') || assetPath.startsWith('../');
}

function normalizeRelativeAssetPath(assetPath) {
  return assetPath.replace(/^(\.\/)+/, '').replace(/^(\.\.\/)+/, '');
}

function getSlugFromFilePath(filePath) {
  return path.basename(path.dirname(filePath));
}

function getSourceAssetPath(filePath, assetPath, kind) {
  const normalizedPath = normalizeRelativeAssetPath(assetPath);

  if (kind === 'en') {
    return path.join(projectRoot, 'content', 'posts', getSlugFromFilePath(filePath), normalizedPath);
  }

  return path.resolve(path.dirname(filePath), normalizedPath);
}

function getTargetAssetPath(filePath, assetPath, publicRoot) {
  return path.join(publicRoot, getSlugFromFilePath(filePath), normalizeRelativeAssetPath(assetPath));
}

async function collectMarkdownFiles(rootDir) {
  const markdownFiles = [];

  async function walk(currentDir) {
    const entries = await readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.name.startsWith('.')) {
        continue;
      }

      const entryPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await walk(entryPath);
        continue;
      }

      if (entry.isFile() && entryPath.endsWith('.md')) {
        markdownFiles.push(entryPath);
      }
    }
  }

  await walk(rootDir);
  return markdownFiles;
}

async function collectReferencedAssets(filePath, kind, publicRoot) {
  const content = await readFile(filePath, 'utf8');
  const tree = unified().use(remarkParse).use(remarkGfm).parse(content);
  const assets = [];

  visit(tree, 'image', (node) => {
    if (!isRelativeAssetPath(node.url)) {
      return;
    }

    assets.push({
      sourcePath: getSourceAssetPath(filePath, node.url, kind),
      targetPath: getTargetAssetPath(filePath, node.url, publicRoot),
    });
  });

  return assets;
}

async function shouldCopyFile(sourcePath, targetPath) {
  try {
    const [sourceStat, targetStat] = await Promise.all([stat(sourcePath), stat(targetPath)]);
    return sourceStat.size !== targetStat.size || sourceStat.mtimeMs > targetStat.mtimeMs;
  }
  catch {
    return true;
  }
}

const registrations = new Map();

for (const { kind, sourceRoot, publicRoot } of syncTargets) {
  const markdownFiles = await collectMarkdownFiles(sourceRoot);

  for (const filePath of markdownFiles) {
    const assets = await collectReferencedAssets(filePath, kind, publicRoot);

    for (const asset of assets) {
      registrations.set(asset.targetPath, asset);
    }
  }
}

const copyTargets = [];

for (const asset of registrations.values()) {
  if (await shouldCopyFile(asset.sourcePath, asset.targetPath)) {
    copyTargets.push(asset);
  }
}

await Promise.all(copyTargets.map(async ({ sourcePath, targetPath }) => {
  await mkdir(path.dirname(targetPath), { recursive: true });
  await copyFile(sourcePath, targetPath);
}));

console.log(`Synced ${copyTargets.length} referenced content asset(s).`);
